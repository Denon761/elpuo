"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { MIN_ORDER_QTY, SIZES } from "@/lib/catalog";
import { useUploadThing } from "@/lib/uploadthing";
import type { OptionGroup, Sport } from "@/lib/types";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "sales@example.com";
const MAX_FILE_MB = 8;

type Status = "idle" | "sending" | "sent" | "error";

interface Player {
  id: string;
  name: string;
  number: string;
}

let playerSeq = 0;
const newPlayer = (): Player => ({ id: `p${++playerSeq}`, name: "", number: "" });

function serializeRoster(players: Player[]): string {
  return players
    .map((p) => `${p.name.trim()} ${p.number.trim()}`.trim())
    .filter(Boolean)
    .join("\n");
}

function initSelections(groups: OptionGroup[]) {
  const s: Record<string, string | string[]> = {};
  for (const g of groups) {
    s[g.id] = Array.isArray(g.defaultValue) ? [...g.defaultValue] : g.defaultValue;
  }
  return s;
}

export function QuoteForm({ sport, groups }: { sport: Sport; groups: OptionGroup[] }) {
  const [selections, setSelections] = useState(() => initSelections(groups));
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [designNotes, setDesignNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);

  const [c, setC] = useState({
    organization: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [ref, setRef] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("quoteReference", {
    onClientUploadComplete: (res) => {
      setReferenceUrl(res?.[0]?.ufsUrl ?? res?.[0]?.url ?? null);
      setFieldErrors((p) => ({ ...p, file: "" }));
    },
    onUploadError: (err) => {
      setReferenceUrl(null);
      setFile(null);
      setFilePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      if (fileInput.current) fileInput.current.value = "";
      setFieldErrors((p) => ({
        ...p,
        file: err.message || "Upload failed — please try again",
      }));
    },
  });

  const totalQty = useMemo(
    () => Object.values(sizes).reduce((a, b) => a + (Number(b) || 0), 0),
    [sizes]
  );

  function setSingle(groupId: string, value: string) {
    setSelections((s) => ({ ...s, [groupId]: value }));
  }
  function toggleMulti(groupId: string, id: string) {
    setSelections((s) => {
      const cur = Array.isArray(s[groupId]) ? (s[groupId] as string[]) : [];
      return {
        ...s,
        [groupId]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
      };
    });
  }
  function setC1(key: keyof typeof c) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setC((p) => ({ ...p, [key]: e.target.value }));
  }

  function addPlayer() {
    setPlayers((p) => [...p, newPlayer()]);
  }
  function updatePlayer(id: string, patch: Partial<Player>) {
    setPlayers((p) => p.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }
  function removePlayer(id: string) {
    setPlayers((p) => p.filter((row) => row.id !== id));
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (filePreview) URL.revokeObjectURL(filePreview);
    setReferenceUrl(null);
    if (!f) {
      setFile(null);
      setFilePreview(null);
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFieldErrors((p) => ({ ...p, file: `Max ${MAX_FILE_MB} MB` }));
      setFile(null);
      setFilePreview(null);
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    setFieldErrors((p) => ({ ...p, file: "" }));
    setFile(f);
    setFilePreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
    // Push straight to UploadThing; the returned URL is submitted with the form.
    startUpload([f]);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!c.contactName.trim()) e.contactName = "Required";
    if (!c.email.trim()) e.email = "Required";
    else if (!/.+@.+\..+/.test(c.email)) e.email = "Enter a valid email";
    if (!c.country.trim()) e.country = "Required";
    if (totalQty < MIN_ORDER_QTY)
      e.sizes = `Minimum order is ${MIN_ORDER_QTY} units`;
    if (file && !referenceUrl)
      e.file = isUploading
        ? "Wait for the upload to finish"
        : "Re-select your reference file — it didn't upload";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    const fd = new FormData();
    fd.set("sport", sport.slug);
    fd.set("fabric", String(selections.fabric ?? ""));
    fd.set("method", String(selections.method ?? ""));
    fd.set("kit", String(selections.kit ?? ""));
    fd.set("technique", String(selections.technique ?? ""));
    for (const id of (selections.extras as string[]) ?? []) fd.append("extras", id);
    fd.set("sizes", JSON.stringify(sizes));
    fd.set("totalQty", String(totalQty));
    fd.set("roster", serializeRoster(players));
    fd.set("designNotes", designNotes);
    fd.set("organization", c.organization);
    fd.set("contactName", c.contactName);
    fd.set("email", c.email);
    fd.set("phone", c.phone);
    fd.set("country", c.country);
    fd.set("city", c.city);
    if (referenceUrl) {
      fd.set("referenceUrl", referenceUrl);
      if (file) fd.set("referenceName", file.name);
    }

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/quote", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setRef(data.ref || "");
        setStatus("sent");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please check your connection and retry.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-volt/50 bg-volt/10 p-8">
        <p className="kicker text-volt">Request received</p>
        <h2 className="display-3 mt-3 text-2xl">Thanks, {c.contactName.split(" ")[0] || "there"}.</h2>
        <p className="mt-3 text-paper/70">
          Your {sport.name.toLowerCase()} kit request is with our studio
          {ref ? <> under reference <strong className="text-paper">{ref}</strong></> : null}. A
          specialist will review it and reply to{" "}
          <strong className="text-paper">{c.email}</strong> within one business day with a
          firm quote and a proof.
        </p>
        <p className="mt-4 text-sm text-paper/50">
          Nothing has been charged. Questions? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-volt link-underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <Link
          href="/sports"
          className="mt-6 inline-flex rounded-[8px] bg-lime px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-volt-ink"
        >
          Request another kit
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* 1 — KIT */}
      <section>
        <Legend n="1" title="Your kit" />
        <div className="mt-5 space-y-5">
          {groups.map((g) =>
            g.type === "single" ? (
              <div key={g.id}>
                <p className="field-label">{g.label}</p>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((o) => {
                    const on = selections[g.id] === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setSingle(g.id, o.id)}
                        aria-pressed={on}
                        className={`rounded-[8px] border px-3.5 py-2 text-sm transition-colors ${
                          on
                            ? "border-volt bg-volt/10 text-paper"
                            : "border-line text-paper/65 hover:border-line-strong"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div key={g.id}>
                <p className="field-label">{g.label}</p>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((o) => {
                    const on = ((selections[g.id] as string[]) ?? []).includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => toggleMulti(g.id, o.id)}
                        aria-pressed={on}
                        className={`rounded-[8px] border px-3.5 py-2 text-sm transition-colors ${
                          on
                            ? "border-volt bg-volt/10 text-paper"
                            : "border-line text-paper/65 hover:border-line-strong"
                        }`}
                      >
                        {on ? "✓ " : "+ "}
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* size quantities */}
          <div>
            <div className="flex items-baseline justify-between">
              <p className="field-label mb-0">
                Quantity by size{" "}
                <span className="text-paper/35">(min. {MIN_ORDER_QTY})</span>
              </p>
              <p className="text-xs text-paper/45">
                Total <span className="text-paper/80">{totalQty}</span>
              </p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {SIZES.map((s) => (
                <label key={s} className="flex flex-col">
                  <span className="text-center text-[0.65rem] uppercase tracking-wide text-paper/45">
                    {s}
                  </span>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={sizes[s] ?? ""}
                    onChange={(e) =>
                      setSizes((p) => ({ ...p, [s]: Math.max(0, Number(e.target.value) || 0) }))
                    }
                    placeholder="0"
                    className="field !px-2 !py-1.5 text-center text-sm"
                  />
                </label>
              ))}
            </div>
            {fieldErrors.sizes && (
              <p className="mt-1 text-xs text-ember">{fieldErrors.sizes}</p>
            )}
          </div>

          {/* players */}
          <div>
            <div className="flex items-baseline justify-between">
              <p className="field-label mb-0">
                Player names &amp; numbers{" "}
                <span className="text-paper/35">(optional)</span>
              </p>
              {players.length > 0 && (
                <p className="text-xs text-paper/45">
                  {players.length} player{players.length === 1 ? "" : "s"}
                </p>
              )}
            </div>

            {players.length > 0 && (
              <ul className="mt-3 space-y-2">
                {players.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-center text-xs font-semibold text-paper/40">
                      {i + 1}
                    </span>
                    <input
                      value={p.name}
                      onChange={(e) => updatePlayer(p.id, { name: e.target.value })}
                      placeholder="Name on back"
                      aria-label={`Player ${i + 1} name`}
                      className="field !py-2 min-w-0 flex-1 text-sm"
                    />
                    <input
                      value={p.number}
                      onChange={(e) =>
                        updatePlayer(p.id, {
                          number: e.target.value.replace(/[^0-9]/g, "").slice(0, 3),
                        })
                      }
                      inputMode="numeric"
                      placeholder="No."
                      aria-label={`Player ${i + 1} number`}
                      className="field !w-16 !py-2 shrink-0 text-center text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removePlayer(p.id)}
                      aria-label={`Remove player ${i + 1}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] border border-line text-paper/40 transition-colors hover:border-ember hover:text-ember"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={addPlayer}
              className="mt-3 inline-flex items-center gap-2.5 rounded-[8px] border border-line-strong py-2 pl-2 pr-4 text-sm font-medium text-paper/80 transition-colors hover:border-volt hover:text-volt"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-volt/15 text-[0.72rem] font-bold text-volt">
                {players.length + 1}
              </span>
              Add {players.length === 0 ? "new" : "another"} player
            </button>
          </div>
        </div>
      </section>

      {/* 2 — REFERENCE */}
      <section>
        <Legend n="2" title="Reference design" />
        <div className="mt-5 space-y-4">
          <div>
            <p className="field-label">Upload the design you have in mind</p>
            <label className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-line-strong bg-ink-2 p-4 transition-colors hover:border-volt">
              <input
                ref={fileInput}
                type="file"
                accept="image/*,.pdf,.ai,.eps"
                onChange={onFile}
                className="sr-only"
              />
              {filePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={filePreview}
                  alt="Reference preview"
                  className="h-16 w-16 rounded-sm object-cover"
                />
              ) : (
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-sm border border-line text-paper/40">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 16V4m0 0 4 4m-4-4L8 8" />
                    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  </svg>
                </span>
              )}
              <span className="text-sm">
                <span className="font-semibold text-paper">
                  {file ? file.name : "Choose a file"}
                </span>
                <span className="mt-0.5 block text-xs text-paper/45">
                  {isUploading
                    ? "Uploading…"
                    : referenceUrl
                      ? "✓ Uploaded"
                      : `PNG, JPG, PDF, AI or EPS · up to ${MAX_FILE_MB} MB`}
                </span>
                {referenceUrl && (
                  <a
                    href={referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5 block truncate text-xs text-volt link-underline"
                  >
                    {referenceUrl}
                  </a>
                )}
                {fieldErrors.file && (
                  <span className="mt-0.5 block text-xs text-ember">{fieldErrors.file}</span>
                )}
              </span>
            </label>
          </div>

          <div>
            <label htmlFor="notes" className="field-label">
              Design notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              placeholder="Team colours (Pantone if you have them), sponsor placement, collar style, deadline, links to artwork…"
              className="field resize-none"
            />
          </div>
        </div>
      </section>

      {/* 3 — DETAILS */}
      <section>
        <Legend n="3" title="Your details" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Club / organisation">
            <input className="field" value={c.organization} onChange={setC1("organization")} />
          </Field>
          <Field label="Your name *" error={fieldErrors.contactName}>
            <input className="field" value={c.contactName} onChange={setC1("contactName")} />
          </Field>
          <Field label="Email *" error={fieldErrors.email}>
            <input type="email" className="field" value={c.email} onChange={setC1("email")} />
          </Field>
          <Field label="Phone">
            <input className="field" value={c.phone} onChange={setC1("phone")} />
          </Field>
          <Field label="Country *" error={fieldErrors.country}>
            <input className="field" value={c.country} onChange={setC1("country")} />
          </Field>
          <Field label="City">
            <input className="field" value={c.city} onChange={setC1("city")} />
          </Field>
        </div>
      </section>

      {status === "error" && (
        <p className="rounded-md border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
          {errorMsg}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "sending" || isUploading}
          className="w-full rounded-[8px] bg-lime px-6 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-volt-ink transition-colors hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-10"
        >
          {status === "sending"
            ? "Sending…"
            : isUploading
              ? "Uploading design…"
              : "Submit quote request"}
        </button>
        <p className="mt-3 text-xs text-paper/45">
          No payment now. We reply with a firm quote and a proof within one business day.
        </p>
      </div>
    </form>
  );
}

function Legend({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-line pb-3">
      <span className="font-display text-2xl text-volt">{n}</span>
      <h2 className="display-3 text-xl">{title}</h2>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-ember">{error}</p>}
    </div>
  );
}
