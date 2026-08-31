"use client";

import { useState } from "react";

export function NewsletterField() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="mt-6 rounded-sm border border-volt/40 bg-volt/10 px-4 py-3 text-sm text-volt">
        You&apos;re on the list — kit drops and team offers incoming.
      </p>
    );
  }

  return (
    <form
      className="mt-6 flex max-w-sm items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (/.+@.+\..+/.test(email)) setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@club.com"
        className="field"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="shrink-0 rounded-[8px] bg-lime px-4 py-[0.85rem] text-[0.7rem] font-bold uppercase tracking-[0.12em] text-volt-ink transition-colors hover:bg-white"
      >
        Join
      </button>
    </form>
  );
}
