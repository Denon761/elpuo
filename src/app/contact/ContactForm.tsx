"use client";

import { useId, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", org: "", message: "" });
  const [error, setError] = useState("");
  const uid = useId();
  const fid = (k: string) => `${uid}-${k}`;

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  if (sent) {
    return (
      <div
        className="rounded-lg border border-volt/40 bg-volt/10 p-8"
        role="status"
      >
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

  const invalid = {
    name: !!error && !form.name.trim(),
    email: !!error && !/.+@.+\..+/.test(form.email),
    message: !!error && !form.message.trim(),
  };

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim() || !/.+@.+\..+/.test(form.email) || !form.message.trim()) {
          setError("Add your name, a valid email and a message.");
          const firstBad = !form.name.trim()
            ? "name"
            : !/.+@.+\..+/.test(form.email)
              ? "email"
              : "message";
          document.getElementById(fid(firstBad))?.focus();
          return;
        }
        setError("");
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fid("name")} className="field-label">
            Name
          </label>
          <input
            id={fid("name")}
            className="field"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            aria-invalid={invalid.name || undefined}
          />
        </div>
        <div>
          <label htmlFor={fid("email")} className="field-label">
            Email
          </label>
          <input
            id={fid("email")}
            type="email"
            autoComplete="email"
            className="field"
            value={form.email}
            onChange={set("email")}
            aria-invalid={invalid.email || undefined}
          />
        </div>
      </div>
      <div>
        <label htmlFor={fid("org")} className="field-label">
          Club / organisation
        </label>
        <input
          id={fid("org")}
          className="field"
          autoComplete="organization"
          value={form.org}
          onChange={set("org")}
        />
      </div>
      <div>
        <label htmlFor={fid("message")} className="field-label">
          Message
        </label>
        <textarea
          id={fid("message")}
          rows={5}
          className="field resize-none"
          value={form.message}
          onChange={set("message")}
          aria-invalid={invalid.message || undefined}
          aria-describedby={error ? fid("error") : undefined}
          placeholder="Tell us about the team, the sports involved and roughly how many units."
        />
      </div>
      <p
        id={fid("error")}
        role="alert"
        aria-live="assertive"
        className="text-xs font-medium text-ember empty:hidden"
      >
        {error}
      </p>
      <button
        type="submit"
        className="rounded-[8px] bg-lime px-6 py-3.5 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-volt-ink transition-opacity hover:opacity-90"
      >
        Send message
      </button>
    </form>
  );
}
