"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", org: "", message: "" });
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  if (sent) {
    return (
      <div className="rounded-lg border border-volt/40 bg-volt/10 p-8">
        <h3 className="display-3 text-2xl text-volt">Message queued</h3>
        <p className="mt-2 text-sm text-paper/70">
          Thanks {form.name.split(" ")[0] || "there"} — we&apos;ll reply to{" "}
          {form.email} within one business day. For live kit configuration, the{" "}
          <a href="/sports" className="link-underline text-volt">
            builder
          </a>{" "}
          is the fastest route to a quote.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim() || !/.+@.+\..+/.test(form.email) || !form.message.trim()) {
          setError("Add your name, a valid email and a message.");
          return;
        }
        setError("");
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Name</label>
          <input className="field" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className="field-label">Email</label>
          <input type="email" className="field" value={form.email} onChange={set("email")} />
        </div>
      </div>
      <div>
        <label className="field-label">Club / organisation</label>
        <input className="field" value={form.org} onChange={set("org")} />
      </div>
      <div>
        <label className="field-label">Message</label>
        <textarea
          rows={5}
          className="field resize-none"
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us about the team, the sports involved and roughly how many units."
        />
      </div>
      {error && <p className="text-xs text-ember">{error}</p>}
      <button
        type="submit"
        className="rounded-[8px] bg-lime px-6 py-3.5 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-volt-ink transition-colors hover:bg-white"
      >
        Send message
      </button>
    </form>
  );
}
