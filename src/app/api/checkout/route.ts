import { NextResponse } from "next/server";
import { DESIGN_METHOD, EXTRAS, FABRIC, KIT, MIN_ORDER_QTY, TECHNIQUE, getSport } from "@/lib/catalog";
import { quoteRef, usd } from "@/lib/format";
import { clientIp, looksLikeSpam, rateLimit } from "@/lib/mailer";
import { BULK_THRESHOLD, priceForQty } from "@/lib/pricing";
import { abs } from "@/lib/site";
import { getStripe, PaymentNotConfiguredError } from "@/lib/stripe";

export const runtime = "nodejs";

const GROUPS = { fabric: FABRIC, method: DESIGN_METHOD, kit: KIT, technique: TECHNIQUE };

function optionLabel(groupKey: keyof typeof GROUPS, id: string): string {
  return GROUPS[groupKey].options.find((o) => o.id === id)?.label ?? id ?? "—";
}

function extrasLabels(ids: string[]): string {
  if (!ids.length) return "None";
  return ids.map((id) => EXTRAS.options.find((o) => o.id === id)?.label ?? id).join(", ");
}

/** Stripe metadata values are capped at 500 chars. */
const trim = (s: string, n = 490) => (s.length > n ? `${s.slice(0, n)}…` : s);

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
  const country = str("country");
  const sport = getSport(sportSlug);

  // Same spam defence as /api/quote — honeypot + time-trap + link flooding.
  const renderedAt = Number(str("t")) || 0;
  if (
    looksLikeSpam({
      honeypot: str("company"),
      elapsedMs: renderedAt ? Date.now() - renderedAt : undefined,
      text: `${str("designNotes")} ${str("roster")}`,
    })
  ) {
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 400 });
  }

  const limit = rateLimit(`checkout:${clientIp(req)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  if (!sport || !contactName || !email || !phone || !country) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email, phone, country and pick a sport." },
      { status: 422 }
    );
  }
  if (!/.+@.+\..+/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address looks invalid." }, { status: 422 });
  }

  const qty = Math.round(Number(str("qty")) || 0);
  if (qty < MIN_ORDER_QTY || qty >= BULK_THRESHOLD) {
    return NextResponse.json(
      {
        ok: false,
        error: `On-site checkout is for orders between ${MIN_ORDER_QTY} and ${BULK_THRESHOLD - 1} units — larger orders go through a free quote instead.`,
      },
      { status: 422 }
    );
  }

  const selections = {
    fabric: str("fabric"),
    method: str("method"),
    kit: str("kit"),
    technique: str("technique"),
    extras: form.getAll("extras").map((v) => v.toString()),
  };

  // Authoritative price — computed server-side from catalog data only.
  // The client's live price display is for UX; it is never trusted here.
  const quote = priceForQty(sport, selections, qty);

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    if (err instanceof PaymentNotConfiguredError) {
      console.error("[checkout] STRIPE_SECRET_KEY is not set — see .env.example");
      return NextResponse.json(
        { ok: false, error: "On-site checkout isn't configured yet. Please email us directly." },
        { status: 500 }
      );
    }
    throw err;
  }

  const ref = quoteRef();
  const designHelp = str("designHelp") === "yes";
  const referenceUrl = str("referenceUrl");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Embedded, not hosted — the payment form renders directly on the
      // sport page via the publishable key; the customer never leaves the
      // site. return_url is only used if a payment method needs a full-page
      // redirect (e.g. 3D Secure) and then brings them back.
      ui_mode: "embedded_page",
      return_url: abs(
        `/thank-you?sport=${sport.slug}&paid=1&ref=${ref}&session_id={CHECKOUT_SESSION_ID}`
      ),
      customer_email: email,
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(quote.unitPriceDiscounted * 100),
            product_data: {
              name: `Custom ${sport.name} Uniform`,
              description: `${optionLabel("fabric", selections.fabric)} · ${optionLabel(
                "method",
                selections.method
              )} · ${optionLabel("kit", selections.kit)} · ${optionLabel("technique", selections.technique)}`,
            },
          },
        },
      ],
      metadata: {
        ref,
        sport: sport.slug,
        qty: String(qty),
        unitPrice: usd(quote.unitPriceDiscounted),
        total: usd(quote.total),
        fabric: optionLabel("fabric", selections.fabric),
        method: optionLabel("method", selections.method),
        kit: optionLabel("kit", selections.kit),
        technique: optionLabel("technique", selections.technique),
        extras: extrasLabels(selections.extras),
        sizes: trim(str("sizes")),
        roster: trim(str("roster")),
        designHelp: designHelp ? "yes" : "no",
        designNotes: trim(str("designNotes")),
        referenceUrl: trim(referenceUrl),
        organization: str("organization"),
        contactName,
        email,
        phone: str("phone"),
        country,
        city: str("city"),
      },
    });

    if (!session.client_secret) throw new Error("Stripe session created without a client secret");
    return NextResponse.json({ ok: true, clientSecret: session.client_secret, ref });
  } catch (err) {
    console.error("[checkout] stripe session creation failed:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't start checkout. Please try again or email us directly." },
      { status: 502 }
    );
  }
}
