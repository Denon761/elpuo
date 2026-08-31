import { NextResponse } from "next/server";
import { contactAutoReplyEmail } from "@/lib/emails";
import {
  clientIp,
  escapeHtml,
  getMailer,
  looksLikeSpam,
  MailNotConfiguredError,
  rateLimit,
} from "@/lib/mailer";

export const runtime = "nodejs";

interface Body {
  name?: string;
  email?: string;
  org?: string;
  message?: string;
  /** Honeypot — must stay empty. */
  company?: string;
  /** Client render time (ms epoch) for the time-trap. */
  t?: number;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const org = (body.org ?? "").trim();
  const message = (body.message ?? "").trim();
  const elapsedMs =
    typeof body.t === "number" && body.t > 0 ? Date.now() - body.t : undefined;

  // Silent drop for bots — respond 200 so they don't learn anything.
  if (looksLikeSpam({ honeypot: body.company, elapsedMs, text: message })) {
    return NextResponse.json({ ok: true });
  }

  const limit = rateLimit(`contact:${clientIp(req)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  if (!name || name.length > 100) {
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 422 });
  }
  if (!/.+@.+\..+/.test(email) || email.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Please add a valid email address." },
      { status: 422 }
    );
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Please add a message (at least a sentence)." },
      { status: 422 }
    );
  }

  let mailer;
  try {
    mailer = getMailer();
  } catch (err) {
    if (err instanceof MailNotConfiguredError) {
      console.error("[contact] SMTP env vars are not set — see .env.example");
      return NextResponse.json(
        { ok: false, error: "Our mailbox isn't configured yet. Please email us directly." },
        { status: 500 }
      );
    }
    throw err;
  }

  const { transporter, from, studioAddresses } = mailer;
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Organisation", org || "—"],
    ["Message", message],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
      <p style="margin:0 0 2px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:#b34a09">Contact form</p>
      <h2 style="margin:0 0 12px;font-size:20px">${escapeHtml(name)}${org ? ` — ${escapeHtml(org)}` : ""}</h2>
      <table cellpadding="7" style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="border:1px solid #eee;background:#faf7f4;font-weight:600;white-space:nowrap;vertical-align:top">${escapeHtml(
                k
              )}</td><td style="border:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;

  try {
    await transporter.sendMail({
      from,
      to: studioAddresses,
      replyTo: `${name} <${email}>`,
      subject: `Contact form: ${name}${org ? ` (${org})` : ""}`,
      text,
      html,
    });
  } catch (err) {
    console.error("[contact] sendMail failed:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message. Please email us directly." },
      { status: 502 }
    );
  }

  // Auto-reply to the sender — best effort, never fails the request.
  try {
    await transporter.sendMail({
      from,
      to: email,
      replyTo: studioAddresses[0] || from,
      ...contactAutoReplyEmail({
        firstName: name.split(" ")[0] || "",
        message,
        contactEmail: studioAddresses[0] || from,
      }),
    });
  } catch (err) {
    console.error("[contact] auto-reply failed:", err);
  }

  return NextResponse.json({ ok: true });
}
