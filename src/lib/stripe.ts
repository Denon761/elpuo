import Stripe from "stripe";

/**
 * Thrown when STRIPE_SECRET_KEY is missing. The checkout route catches this
 * and returns a "payment isn't configured" response instead of a generic
 * 500 — same pattern as MailNotConfiguredError in mailer.ts.
 */
export class PaymentNotConfiguredError extends Error {
  constructor() {
    super("STRIPE_SECRET_KEY is not set — see .env.example");
    this.name = "PaymentNotConfiguredError";
  }
}

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new PaymentNotConfiguredError();
  cached = new Stripe(key);
  return cached;
}
