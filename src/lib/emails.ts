/* ------------------------------------------------------------------ *
   Transactional email templates. Themed to match the Elpuo site:
   warm off-white ground (#efece3), near-black ink (#16161a), orange
   brand (#f26a21 / #b34a09), condensed uppercase headings.
 * ------------------------------------------------------------------ */

import { FACTS } from "./site";

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
  );
}

const C = {
  ground: "#efece3",
  card: "#f8f6ef",
  line: "#e2ddd0",
  ink: "#16161a",
  body: "#3a3a40",
  mist: "#6c6b62",
  faint: "#8a887e",
  brand: "#f26a21",
  brandDark: "#b34a09",
  tint: "#fff6ef",
  zebra: "#f2efe6",
  white: "#ffffff",
};

const HEAD_FONT = "'Arial Narrow', 'Oswald', Arial, sans-serif";
const BODY_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export interface CustomerConfirmationInput {
  firstName: string;
  sportName: string;
  ref: string;
  email: string;
  /** Label / value pairs summarising the request. */
  summary: [string, string][];
  contactEmail: string;
}

const NEXT_STEPS = [
  "We check your fabric and sizing against production specs.",
  `A firm quote lands in your inbox within ${FACTS.quoteReplyDays} business day.`,
  `A full digital proof follows within ${FACTS.proofDays} business days.`,
  `You approve the proof — then production runs roughly ${FACTS.productionDays} working days.`,
];

export function customerConfirmationEmail(input: CustomerConfirmationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const { firstName, sportName, ref, email, summary, contactEmail } = input;
  const hi = firstName ? `, ${esc(firstName)}` : "";

  const rows = summary
    .map(
      ([k, v], i) => `
        <tr>
          <td style="padding:10px 14px;background:${
            i % 2 ? C.white : C.zebra
          };font-size:13px;font-weight:700;color:${C.mist};white-space:nowrap;border-radius:6px 0 0 6px;">${esc(
            k
          )}</td>
          <td style="padding:10px 14px;background:${
            i % 2 ? C.white : C.zebra
          };font-size:13px;color:${C.ink};border-radius:0 6px 6px 0;">${esc(v)}</td>
        </tr>
        <tr><td colspan="2" style="height:4px;line-height:4px;font-size:4px;">&nbsp;</td></tr>`
    )
    .join("");

  const steps = NEXT_STEPS.map(
    (s, i) => `
      <tr>
        <td width="34" valign="top" style="padding:0 12px 14px 0;">
          <div style="width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:${C.brand};color:${C.white};font-family:${HEAD_FONT};font-weight:700;font-size:14px;">${i + 1}</div>
        </td>
        <td valign="top" style="padding:0 0 14px;font-size:14px;line-height:1.55;color:${C.body};">${esc(s)}</td>
      </tr>`
  ).join("");

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Request received</title></head>
<body style="margin:0;padding:0;background:${C.ground};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ground};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:${C.card};border:1px solid ${C.line};border-radius:14px;overflow:hidden;font-family:${BODY_FONT};">
          <tr>
            <td style="background:${C.brand};padding:20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-family:${HEAD_FONT};font-weight:700;text-transform:uppercase;letter-spacing:0.22em;font-size:20px;color:${C.white};">ELPUO</td>
                <td align="right" style="font-size:11px;text-transform:uppercase;letter-spacing:0.16em;color:rgba(255,255,255,0.82);">Custom teamwear</td>
              </tr></table>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px 4px;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.26em;color:${C.brandDark};">Request received</p>
              <h1 style="margin:0 0 16px;font-family:${HEAD_FONT};font-weight:700;text-transform:uppercase;letter-spacing:0.02em;font-size:36px;line-height:1;color:${C.ink};">Thank you${hi}</h1>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:${C.body};">
                Your <strong style="color:${C.ink};">${esc(sportName)}</strong> kit request is with our studio. A specialist will review every detail and reply to <strong style="color:${C.ink};">${esc(email)}</strong> within ${FACTS.quoteReplyDays} business day with a firm quote — a full digital proof follows within ${FACTS.proofDays} business days.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 26px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px dashed #d8b48f;border-radius:10px;background:${C.tint};">
                <tr><td style="padding:14px 18px;">
                  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:${C.brandDark};">Your reference</span><br>
                  <span style="font-family:${HEAD_FONT};font-weight:700;font-size:24px;letter-spacing:0.05em;color:${C.ink};">${esc(ref)}</span>
                </td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.22em;color:${C.mist};">Your selections</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;">
                ${rows}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 4px;">
              <p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.22em;color:${C.mist};">What happens next</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table>
            </td>
          </tr>

          <tr>
            <td style="padding:6px 32px 34px;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:${C.mist};">Nothing has been charged — this is a request, not an order. Reply to this email if you need to add or change anything.</p>
            </td>
          </tr>

          <tr>
            <td style="background:${C.ground};padding:20px 32px;border-top:1px solid ${C.line};">
              <p style="margin:0;font-size:12px;line-height:1.7;color:${C.faint};">
                Elpuo &middot; Custom sports uniforms<br>
                Questions? <a href="mailto:${esc(contactEmail)}" style="color:${C.brandDark};text-decoration:none;">${esc(contactEmail)}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#a2a096;font-family:${BODY_FONT};">You received this because a quote was requested at Elpuo.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Thank you${firstName ? `, ${firstName}` : ""}.`,
    ``,
    `Your ${sportName} kit request is with our studio. A specialist will reply to ${email} within ${FACTS.quoteReplyDays} business day with a firm quote — a full digital proof follows within ${FACTS.proofDays} business days.`,
    ``,
    `Your reference: ${ref}`,
    ``,
    `Your selections`,
    ...summary.map(([k, v]) => `  ${k}: ${v}`),
    ``,
    `What happens next`,
    ...NEXT_STEPS.map((s, i) => `  ${i + 1}. ${s}`),
    ``,
    `Nothing has been charged — this is a request, not an order. Reply to this email if you need to change anything.`,
    ``,
    `Elpuo · Custom sports uniforms · ${contactEmail}`,
  ].join("\n");

  return {
    subject: `Thanks — your ${sportName} quote request (${ref})`,
    html,
    text,
  };
}

/* ------------------------------------------------------------------ *
   Contact-form auto-reply — sent to whoever wrote in.
 * ------------------------------------------------------------------ */

export interface ContactAutoReplyInput {
  firstName: string;
  message: string;
  contactEmail: string;
}

export function contactAutoReplyEmail(input: ContactAutoReplyInput): {
  subject: string;
  html: string;
  text: string;
} {
  const { firstName, message, contactEmail } = input;
  const hi = firstName ? `, ${esc(firstName)}` : "";

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>We got your message</title></head>
<body style="margin:0;padding:0;background:${C.ground};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ground};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:${C.card};border:1px solid ${C.line};border-radius:14px;overflow:hidden;font-family:${BODY_FONT};">
        <tr><td style="background:${C.brand};padding:20px 32px;font-family:${HEAD_FONT};font-weight:700;text-transform:uppercase;letter-spacing:0.22em;font-size:20px;color:${C.white};">ELPUO</td></tr>
        <tr><td style="padding:36px 32px 8px;">
          <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.26em;color:${C.brandDark};">Message received</p>
          <h1 style="margin:0 0 16px;font-family:${HEAD_FONT};font-weight:700;text-transform:uppercase;letter-spacing:0.02em;font-size:32px;line-height:1;color:${C.ink};">Thanks${hi}</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body};">
            We've got your message and a kit specialist will reply within one business day. If your enquiry is about a specific kit, the fastest route to a price is always the <a href="https://www.elpuo.com/sports" style="color:${C.brandDark};">configurator</a>.
          </p>
        </td></tr>
        <tr><td style="padding:0 32px 28px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.22em;color:${C.mist};">Your message</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.zebra};border-radius:10px;">
            <tr><td style="padding:14px 18px;font-size:14px;line-height:1.6;color:${C.ink};white-space:pre-wrap;">${esc(message)}</td></tr>
          </table>
        </td></tr>
        <tr><td style="background:${C.ground};padding:20px 32px;border-top:1px solid ${C.line};">
          <p style="margin:0;font-size:12px;line-height:1.7;color:${C.faint};">
            Elpuo &middot; Custom sports uniforms<br>
            Reply to this email or write to <a href="mailto:${esc(contactEmail)}" style="color:${C.brandDark};text-decoration:none;">${esc(contactEmail)}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Thanks${firstName ? `, ${firstName}` : ""}.`,
    ``,
    `We've got your message and a kit specialist will reply within one business day.`,
    `For a specific kit, the fastest route to a price is the configurator: https://www.elpuo.com/sports`,
    ``,
    `Your message`,
    message,
    ``,
    `Elpuo · Custom sports uniforms · ${contactEmail}`,
  ].join("\n");

  return { subject: "We've got your message — Elpuo", html, text };
}

