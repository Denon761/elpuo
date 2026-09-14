"use client";

import { useId, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", org: "", message: "" });
  const [error, setError] = useState("");
  const honeypot = useRef("");
  const renderedAt = useRef(Date.now());
  const uid = useId();
  const fid = (k: string) => `${uid}-${k}`;

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-volt/40 bg-volt/10 p-8" role="status">
        <h3 className="display-3 text-2xl text-volt">Message sent</h3>
        <p className="mt-2 text-sm text-paper/70">
          Thanks {form.name.split(" ")[0] || "there"} — we&apos;ll reply to{" "}
          {form.email} within one business day, and a confirmation is on its way to
          your inbox. For live kit configuration, the{" "}
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
    message: !!error && form.message.trim().length < 10,
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    if (
      !form.name.trim() ||
      !/.+@.+\..+/.test(form.email) ||
      form.message.trim().length < 10
    ) {
      setError("Add your name, a valid email and a message (at least a sentence).");
      const firstBad = !form.name.trim()
        ? "name"
        : !/.+@.+\..+/.test(form.email)
          ? "email"
          : "message";
      document.getElementById(fid(firstBad))?.focus();
      return;
    }

    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          company: honeypot.current,
          t: renderedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error — please check your connection and retry.");
    }
  }

  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      {/* honeypot — hidden from users, catches bots. Named/labelled away
          from "company"/"website"/etc: real browser autofill (Chrome's
          address/company profile) was matching that name and silently
          filling this field for real visitors, tripping the spam filter
          and blocking legitimate submissions. display:none (not just
          zero-size + opacity) also keeps most autofill engines from
          targeting it at all. */}
      <div aria-hidden style={{ display: "none" }}>
        <label htmlFor={fid("hp")}>Leave this field blank</label>
        <input
          id={fid("hp")}
          name="hp_check"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={(e) => {
            honeypot.current = e.target.value;
          }}
        />
      </div>

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
        disabled={status === "sending"}
        className="rounded-[8px] bg-lime px-6 py-3.5 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-volt-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
