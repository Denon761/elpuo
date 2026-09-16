import { NextResponse } from "next/server";
import { FABRIC, MIN_ORDER_QTY, getSport } from "@/lib/catalog";
import { customerConfirmationEmail } from "@/lib/emails";
import { quoteRef } from "@/lib/format";
import { clientIp, getMailer, looksLikeSpam, MailNotConfiguredError, rateLimit } from "@/lib/mailer";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

const DELIVERY_LABELS: Record<string, string> = {
  "1week": "Within 1 week",
  "2weeks": "Within 2 weeks",
  "1month": "Within 1 month",
};

function fabricLabel(id: string): string {
  return FABRIC.options.find((o) => o.id === id)?.label ?? id ?? "—";
}

function deliveryLabel(id: string): string {
  return DELIVERY_LABELS[id] ?? id ?? "—";
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
  );
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
  }

  const str = (k: string) => (form.get(k) ?? "").toString().trim();

  const sportSlug = str("sport");
  const contactName = str("contactName");
  const email = str("email");
  const phone = str("phone");
  const sport = getSport(sportSlug);

  // Spam defence — honeypot + time-trap + link flooding. Bots get a fake
  // success (with a throwaway reference) so they don't probe further.
  const renderedAt = Number(str("t")) || 0;
  if (
    looksLikeSpam({
      honeypot: str("company"),
      elapsedMs: renderedAt ? Date.now() - renderedAt : undefined,
      text: `${str("designNotes")} ${str("roster")}`,
    })
  ) {
    return NextResponse.json({ ok: true, ref: quoteRef() });
  }

  const limit = rateLimit(`quote:${clientIp(req)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  if (!sport || !contactName || !email || !phone) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email, phone and pick a sport." },
      { status: 422 }
    );
  }
  if (!/.+@.+\..+/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address looks invalid." }, { status: 422 });
  }

  let mailer;
  try {
    mailer = getMailer();
  } catch (err) {
    if (err instanceof MailNotConfiguredError) {
      console.error("[quote] SMTP env vars are not set — set it in .env.local");
      return NextResponse.json(
        { ok: false, error: "The quote mailbox isn't configured yet. Please email us directly." },
        { status: 500 }
      );
    }
    throw err;
  }

  // Optional reference design — uploaded to UploadThing by the client, which
  // submits the resulting URL. We link it in the email and best-effort attach it.
  const referenceUrl = str("referenceUrl");
  const referenceName = str("referenceName");
  const attachments: { filename: string; content: Buffer; contentType?: string }[] = [];

  if (referenceUrl && /^https:\/\/[^\s]+$/.test(referenceUrl)) {
    try {
      const res = await fetch(referenceUrl);
      const len = Number(res.headers.get("content-length") || 0);
      if (res.ok && len <= MAX_FILE_BYTES) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.byteLength <= MAX_FILE_BYTES) {
          attachments.push({
            filename: referenceName || referenceUrl.split("/").pop() || "reference",
            content: buf,
            contentType: res.headers.get("content-type") || undefined,
          });
        }
      }
    } catch (err) {
      console.error("[quote] could not fetch reference for attachment:", err);
      // Non-fatal — the link is still in the email body.
    }
  }

  let sizes: Record<string, number> = {};
  try {
    sizes = JSON.parse(str("sizes") || "{}");
  } catch {
    sizes = {};
  }
  const sizesSum = Object.values(sizes).reduce((a, n) => a + (Number(n) || 0), 0);
  // Sizes are now optional — the approximate quantity from step 1 is the
  // authoritative total; fall back to the size grid if it's somehow missing.
  const totalQty = Number(str("qty")) || sizesSum;
  if (totalQty < MIN_ORDER_QTY) {
    return NextResponse.json(
      { ok: false, error: `Minimum order is ${MIN_ORDER_QTY} units.` },
      { status: 422 }
    );
  }

  const sizeLine =
    Object.entries(sizes)
      .filter(([, n]) => Number(n) > 0)
      .map(([s, n]) => `${s}×${n}`)
      .join("  ") || "Not specified — approximate only";

  const designHelp = str("designHelp") === "yes";

  const ref = quoteRef();
  const rows: [string, string][] = [
    ["Reference", ref],
    ["Sport", sport.name],
    ["Fabric", fabricLabel(str("fabric"))],
    ["Total quantity", String(totalQty)],
    ["Size breakdown", sizeLine],
    ["Players (names / numbers)", str("roster") || "—"],
    ["Estimated delivery", deliveryLabel(str("delivery"))],
    ["Design notes", str("designNotes") || "—"],
    [
      "Reference design",
      designHelp ? "Needs design help — no file uploaded" : referenceUrl || "None uploaded",
    ],
    ["—", "—"],
    ["Contact name", contactName],
    ["Email", email],
    ["Phone", str("phone") || "—"],
    ["Country", str("country") || "—"],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const cell = (k: string, v: string) => {
    const val =
      k === "Reference design" && referenceUrl
        ? `<a href="${esc(referenceUrl)}">${esc(referenceUrl)}</a>`
        : esc(v).replace(/\n/g, "<br>");
    return `<tr><td style="border:1px solid #eee;background:#faf7f4;font-weight:600;white-space:nowrap">${esc(
      k
    )}</td><td style="border:1px solid #eee">${val}</td></tr>`;
  };

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
      <p style="margin:0 0 2px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:#b34a09">New Lead</p>
      <h2 style="margin:0 0 4px;font-size:22px">${esc(contactName)} — ${esc(sport.name)} kit</h2>
      <p style="margin:0 0 16px;color:#666">Reference <strong>${ref}</strong> &middot; reply to <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      <table cellpadding="7" style="border-collapse:collapse;font-size:14px">
        ${rows.map(([k, v]) => cell(k, v)).join("")}
      </table>
      ${
        referenceUrl
          ? `<p style="margin-top:14px;color:#666">Reference design: <a href="${esc(
              referenceUrl
            )}">${esc(referenceUrl)}</a>${
              attachments.length ? " (also attached)" : ""
            }</p>`
          : ""
      }
    </div>`;

  const { transporter, from: fromAddress, studioAddresses } = mailer;

  // 1 — studio notification (must succeed)
  try {
    await transporter.sendMail({
      from: fromAddress,
      to: studioAddresses,
      replyTo: `${contactName} <${email}>`,
      subject: `New Lead: ${contactName} — ${sport.name} kit (${ref})`,
      text,
      html,
      attachments,
    });
  } catch (err) {
    console.error("[quote] sendMail failed:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request. Please email us directly." },
      { status: 502 }
    );
  }

  // 2 — branded confirmation to the customer (best effort — never fails the request)
  try {
    const confirmation = customerConfirmationEmail({
      firstName: contactName.split(" ")[0] || "",
      sportName: sport.name,
      ref,
      email,
      contactEmail: studioAddresses[0] || fromAddress,
      summary: [
        ["Sport", sport.name],
        ["Fabric", fabricLabel(str("fabric"))],
        ["Total quantity", String(totalQty)],
        ["Sizes", sizeLine],
        ["Estimated delivery", deliveryLabel(str("delivery"))],
        [
          "Reference design",
          designHelp ? "You asked us for design help" : referenceUrl ? "Uploaded" : "None",
        ],
      ],
    });
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      replyTo: studioAddresses[0] || fromAddress,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
    });
  } catch (err) {
    console.error("[quote] customer confirmation email failed:", err);
  }

  return NextResponse.json({ ok: true, ref });
}
