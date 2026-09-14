"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { getStripeClient } from "@/lib/stripe-client";

/**
 * Stripe's embedded payment form, mounted directly on the page — the
 * customer pays without ever leaving the site. Requires
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and a clientSecret from a Checkout
 * Session created with ui_mode: "embedded" (see /api/checkout).
 */
export function EmbeddedPayment({
  clientSecret,
  onClose,
}: {
  clientSecret: string;
  onClose: () => void;
}) {
  return (
    <div className="rounded-lg border border-line-strong bg-ink-2 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="kicker text-volt">Secure payment</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-paper/60 link-underline hover:text-paper"
        >
          ← Back to order
        </button>
      </div>
      <div className="overflow-hidden rounded-md bg-paper">
        <EmbeddedCheckoutProvider stripe={getStripeClient()} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}
