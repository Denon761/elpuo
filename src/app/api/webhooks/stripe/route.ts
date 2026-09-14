import { NextResponse } from "next/server";
import { paidOrderConfirmationEmail } from "@/lib/emails";
import { escapeHtml as esc, getMailer, MailNotConfiguredError } from "@/lib/mailer";
import { getStripe, PaymentNotConfiguredError } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Confirms real payment before anything ships or any "paid" email goes out.
 * Stripe calls this once a Checkout Session completes; we verify the
 * signature so nobody can forge a completed-payment event.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not set — set it in .env.local");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    if (!sig) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    if (err instanceof PaymentNotConfiguredError) {
      return NextResponse.json({ error: "Payments not configured" }, { status: 500 });
    }
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const m = session.metadata ?? {};
  const ref = m.ref || session.id;
  const email = m.email || session.customer_email || "";
  const contactName = m.contactName || "";
  const sportName = m.sport || "your";
  const qty = Number(m.qty) || 0;
  const total = m.total || "";

  let mailer;
  try {
    mailer = getMailer();
  } catch (err) {
    if (err instanceof MailNotConfiguredError) {
      console.error("[stripe webhook] SMTP env vars are not set — order paid but no email sent:", ref);
      return NextResponse.json({ received: true, mail: "not configured" });
    }
    throw err;
  }

  const { transporter, from: fromAddress, studioAddresses } = mailer;

  const rows: [string, string][] = [
    ["Reference", ref],
    ["Amount paid", total],
    ["Sport", sportName],
    ["Fabric", m.fabric || "—"],
    ["Decoration method", m.method || "—"],
    ["Kit pieces", m.kit || "—"],
    ["Names / numbers", m.technique || "—"],
    ["Add-ons", m.extras || "—"],
    ["Total quantity", String(qty)],
    ["Size breakdown", m.sizes || "Not specified — approximate only"],
    ["Players (names / numbers)", m.roster || "—"],
    ["Design notes", m.designNotes || "—"],
    [
      "Reference design",
      m.designHelp === "yes" ? "Needs design help — no file uploaded" : m.referenceUrl || "None uploaded",
    ],
    ["—", "—"],
    ["Organisation", m.organization || "—"],
    ["Contact name", contactName],
    ["Email", email],
    ["Phone", m.phone || "—"],
    ["Location", [m.city, m.country].filter(Boolean).join(", ") || "—"],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
      <p style="margin:0 0 2px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:#b34a09">New PAID Order</p>
      <h2 style="margin:0 0 4px;font-size:22px">${esc(contactName)} — ${esc(sportName)} kit (${esc(total)})</h2>
      <p style="margin:0 0 16px;color:#666">Reference <strong>${esc(ref)}</strong> &middot; reply to <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      <table cellpadding="7" style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="border:1px solid #eee;background:#faf7f4;font-weight:600;white-space:nowrap">${esc(
                k
              )}</td><td style="border:1px solid #eee">${esc(v).replace(/\n/g, "<br>")}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;

  // 1 — studio notification (must succeed)
  try {
    await transporter.sendMail({
      from: fromAddress,
      to: studioAddresses,
      replyTo: `${contactName} <${email}>`,
      subject: `New PAID Order: ${contactName} — ${sportName} kit (${ref})`,
      text,
      html,
    });
  } catch (err) {
    console.error("[stripe webhook] studio notification failed:", err);
    return NextResponse.json({ error: "Notification failed" }, { status: 502 });
  }

  // 2 — customer confirmation (best effort — never fails the webhook, Stripe would retry otherwise)
  if (email) {
    try {
      const confirmation = paidOrderConfirmationEmail({
        firstName: contactName.split(" ")[0] || "",
        sportName,
        ref,
        email,
        qty,
        total,
        contactEmail: studioAddresses[0] || fromAddress,
        summary: [
          ["Sport", sportName],
          ["Fabric", m.fabric || "—"],
          ["Decoration", m.method || "—"],
          ["Kit pieces", m.kit || "—"],
          ["Names & numbers", m.technique || "—"],
          ["Add-ons", m.extras || "—"],
          ["Total quantity", String(qty)],
          ["Sizes", m.sizes || "To be confirmed"],
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
      console.error("[stripe webhook] customer confirmation email failed:", err);
    }
  }

  return NextResponse.json({ received: true });
}
