import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { DESIGN_METHOD, EXTRAS, FABRIC, KIT, MIN_ORDER_QTY, TECHNIQUE, getSport } from "@/lib/catalog";
import { customerConfirmationEmail } from "@/lib/emails";
import { quoteRef } from "@/lib/format";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

const GROUPS = { fabric: FABRIC, method: DESIGN_METHOD, kit: KIT, technique: TECHNIQUE };

function optionLabel(groupKey: keyof typeof GROUPS, id: string): string {
  return GROUPS[groupKey].options.find((o) => o.id === id)?.label ?? id ?? "—";
}

function extrasLabels(ids: string[]): string {
  if (!ids.length) return "None";
  return ids
    .map((id) => EXTRAS.options.find((o) => o.id === id)?.label ?? id)
    .join(", ");
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
  const sport = getSport(sportSlug);

  if (!sport || !contactName || !email) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email and pick a sport." },
      { status: 422 }
    );
  }
  if (!/.+@.+\..+/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address looks invalid." }, { status: 422 });
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    QUOTE_TO_EMAIL,
    QUOTE_FROM_EMAIL,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !QUOTE_TO_EMAIL) {
    console.error("[quote] SMTP env vars are not set — see .env.local");
    return NextResponse.json(
      { ok: false, error: "The quote mailbox isn't configured yet. Please email us directly." },
      { status: 500 }
    );
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
  const totalQty = Object.values(sizes).reduce((a, n) => a + (Number(n) || 0), 0);
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
      .join("  ") || "Not specified";

  const extras = form.getAll("extras").map((v) => v.toString());

  const ref = quoteRef();
  const rows: [string, string][] = [
    ["Reference", ref],
    ["Sport", sport.name],
    ["Fabric", optionLabel("fabric", str("fabric"))],
    ["Decoration method", optionLabel("method", str("method"))],
    ["Kit pieces", optionLabel("kit", str("kit"))],
    ["Names / numbers", optionLabel("technique", str("technique"))],
    ["Add-ons", extrasLabels(extras)],
    ["Total quantity", String(totalQty)],
    ["Size breakdown", sizeLine],
    ["Players (names / numbers)", str("roster") || "—"],
    ["Design notes", str("designNotes") || "—"],
    ["Reference design", referenceUrl || "None uploaded"],
    ["—", "—"],
    ["Organisation", str("organization") || "—"],
    ["Contact name", contactName],
    ["Email", email],
    ["Phone", str("phone") || "—"],
    ["Location", [str("city"), str("country")].filter(Boolean).join(", ") || "—"],
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

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const fromAddress = QUOTE_FROM_EMAIL || SMTP_USER;
  const studioAddresses = QUOTE_TO_EMAIL.split(",").map((s) => s.trim());

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
        ["Fabric", optionLabel("fabric", str("fabric"))],
        ["Decoration", optionLabel("method", str("method"))],
        ["Kit pieces", optionLabel("kit", str("kit"))],
        ["Names & numbers", optionLabel("technique", str("technique"))],
        ["Add-ons", extrasLabels(extras)],
        ["Total quantity", String(totalQty)],
        ["Sizes", sizeLine],
        ["Reference design", referenceUrl ? "Uploaded" : "None"],
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
