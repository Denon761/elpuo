"use client";

import { useRouter } from "next/navigation";
import {
  cloneElement,
  isValidElement,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { MIN_ORDER_QTY, SIZES } from "@/lib/catalog";
import { EmbeddedPayment } from "@/components/product/EmbeddedPayment";
import { usd } from "@/lib/format";
import { BULK_THRESHOLD, priceForQty } from "@/lib/pricing";
import { FACTS, QUOTE_TRUST_LINE } from "@/lib/site";
import { useUploadThing } from "@/lib/uploadthing";
import type { OptionGroup, Sport } from "@/lib/types";

const MAX_FILE_MB = 8;

const QTY_CHIPS = [
  { label: "1–10", value: 5 },
  { label: "11–20", value: 15 },
  { label: "21–29", value: 25 },
  { label: `${BULK_THRESHOLD}+`, value: BULK_THRESHOLD },
];

const fieldCls = (err?: string) =>
  `field ${err ? "!border-ember !bg-ember/5" : ""}`;

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

/** The recommended pick for a group, as shown in copy and used by the
 *  "not sure" reset action. */
function recommendedId(g: OptionGroup): string | string[] {
  if (g.type === "multi") return Array.isArray(g.defaultValue) ? g.defaultValue : [];
  return g.options.find((o) => o.recommended)?.id ?? (g.defaultValue as string);
}

function recommendedLabel(g: OptionGroup): string {
  const id = recommendedId(g);
  if (Array.isArray(id)) {
    return g.options
      .filter((o) => id.includes(o.id))
      .map((o) => o.label)
      .join(", ");
  }
  return g.options.find((o) => o.id === id)?.label ?? "";
}

export function QuoteForm({ sport, groups }: { sport: Sport; groups: OptionGroup[] }) {
  const router = useRouter();
  const [selections, setSelections] = useState(() => initSelections(groups));
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [qty, setQty] = useState<number>(MIN_ORDER_QTY);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [needsDesignHelp, setNeedsDesignHelp] = useState(false);
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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInput = useRef<HTMLInputElement>(null);
  const honeypot = useRef("");
  const renderedAt = useRef(Date.now());

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

  const mode: "buy" | "quote" = qty < BULK_THRESHOLD ? "buy" : "quote";

  const sizesTotal = useMemo(
    () => Object.values(sizes).reduce((a, b) => a + (Number(b) || 0), 0),
    [sizes]
  );

  const quote = useMemo(
    () => priceForQty(sport, selections, Math.max(qty, 1)),
    [sport, selections, qty]
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
    if (qty < MIN_ORDER_QTY) e.qty = `Minimum order is ${MIN_ORDER_QTY} units`;
    if (!c.contactName.trim()) e.contactName = "Required";
    if (!c.email.trim()) e.email = "Required";
    else if (!/.+@.+\..+/.test(c.email)) e.email = "Enter a valid email";
    if (!c.phone.trim()) e.phone = "Required";
    if (!c.country.trim()) e.country = "Required";
    if (!needsDesignHelp && file && !referenceUrl)
      e.file = isUploading
        ? "Wait for the upload to finish"
        : "Re-select your reference file — it didn't upload";
    setFieldErrors(e);

    // Move focus to the first field in error so screen-reader and keyboard
    // users are taken straight to what needs fixing.
    const firstError =
      (["qty", "contactName", "email", "phone", "country"] as const).find((k) => e[k]) ??
      (e.file ? "file" : undefined);
    if (firstError) {
      const el =
        firstError === "file" ? fileInput.current : document.getElementById(`qf-${firstError}`);
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    return Object.keys(e).length === 0;
  }

  function buildFormData() {
    const fd = new FormData();
    fd.set("company", honeypot.current);
    fd.set("t", String(renderedAt.current));
    fd.set("sport", sport.slug);
    fd.set("fabric", String(selections.fabric ?? ""));
    fd.set("method", String(selections.method ?? ""));
    fd.set("kit", String(selections.kit ?? ""));
    fd.set("technique", String(selections.technique ?? ""));
    for (const id of (selections.extras as string[]) ?? []) fd.append("extras", id);
    fd.set("qty", String(qty));
    fd.set("sizes", JSON.stringify(sizes));
    fd.set("roster", serializeRoster(players));
    fd.set("designHelp", needsDesignHelp ? "yes" : "");
    fd.set("designNotes", designNotes);
    fd.set("organization", c.organization);
    fd.set("contactName", c.contactName);
    fd.set("email", c.email);
    fd.set("phone", c.phone);
    fd.set("country", c.country);
    fd.set("city", c.city);
    if (!needsDesignHelp && referenceUrl) {
      fd.set("referenceUrl", referenceUrl);
      if (file) fd.set("referenceName", file.name);
    }
    return fd;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    const fd = buildFormData();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch(mode === "buy" ? "/api/checkout" : "/api/quote", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        if (mode === "buy" && data.clientSecret) {
          setClientSecret(data.clientSecret);
          setStatus("idle");
          return;
        }
        setStatus("sent");
        const params = new URLSearchParams({ sport: sport.slug });
        if (data.ref) params.set("ref", data.ref);
        router.push(`/thank-you?${params.toString()}`);
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please check your connection and retry.");
    }
  }

  if (clientSecret) {
    return <EmbeddedPayment clientSecret={clientSecret} onClose={() => setClientSecret(null)} />;
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-volt/50 bg-volt/10 p-8" role="status">
        <p className="kicker text-volt">Request received</p>
        <h2 className="display-3 mt-3 text-2xl">
          Thanks, {c.contactName.split(" ")[0] || "there"}.
        </h2>
        <p className="mt-3 text-paper/70">Taking you to your confirmation…</p>
      </div>
    );
  }

  const recommendedSummary = groups
    .map((g) => recommendedLabel(g))
    .filter(Boolean)
    .join(", ");

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* honeypot — hidden from users, catches bots. Named/labelled away
          from "company"/"website"/etc: real browser autofill (Chrome's
          address/company profile) was matching that name and silently
          filling this field for real visitors, tripping the spam filter
          and blocking legitimate submissions. display:none (not just
          zero-size + opacity) also keeps most autofill engines from
          targeting it at all. */}
      <div aria-hidden style={{ display: "none" }}>
        <label htmlFor="qf-hp">Leave this field blank</label>
        <input
          id="qf-hp"
          name="hp_check"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={(e) => {
            honeypot.current = e.target.value;
          }}
        />
      </div>

      {/* 1 — QUANTITY */}
      <section>
        <Legend n="1" title="How many do you need?" />
        <div className="mt-5 rounded-lg border border-line-strong bg-ink-2 p-5 sm:p-6">
          <p className="text-sm text-paper/55">
            A rough headcount is enough to start — exact sizes are optional and
            come later.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] border border-line-strong text-lg text-paper/70 transition-colors hover:border-volt hover:text-volt"
            >
              −
            </button>
            <input
              id="qf-qty"
              type="number"
              min={1}
              inputMode="numeric"
              aria-label="Exact quantity"
              aria-invalid={fieldErrors.qty ? true : undefined}
              aria-describedby={fieldErrors.qty ? "err-qty" : undefined}
              value={qty}
              onChange={(e) => setQty(Math.max(0, Number(e.target.value) || 0))}
              className={`${fieldCls(fieldErrors.qty)} !w-24 text-center font-display text-xl`}
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] border border-line-strong text-lg text-paper/70 transition-colors hover:border-volt hover:text-volt"
            >
              +
            </button>
            <span className="text-sm text-paper/60">units total</span>
          </div>

          {fieldErrors.qty && (
            <p id="err-qty" role="alert" className="mt-2 text-xs font-medium text-ember">
              {fieldErrors.qty}
            </p>
          )}

          <div
            className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4"
            role="group"
            aria-label="Approximate quantity"
          >
            {QTY_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setQty(chip.value)}
                className={`rounded-[8px] border px-3.5 py-2 text-sm transition-colors ${
                  qty === chip.value
                    ? "border-volt bg-volt/10 text-paper"
                    : "border-line text-paper/65 hover:border-line-strong"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2 — DETAILS */}
      <section>
        <Legend n="2" title="Your details" />
        <p className="mt-3 text-sm text-paper/55">
          So we can send your {mode === "buy" ? "confirmation" : "quote and proof"}{" "}
          back to you. We never share these or add you to a mailing list.
        </p>

        <div className="mt-5 rounded-lg border border-line-strong bg-ink-2 p-5 sm:p-6">
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <Field label="Your name" required error={fieldErrors.contactName}>
              <input
                id="qf-contactName"
                className={fieldCls(fieldErrors.contactName)}
                placeholder="Alex Morgan"
                autoComplete="name"
                value={c.contactName}
                onChange={setC1("contactName")}
              />
            </Field>
            <Field
              label="Email"
              required
              hint={
                mode === "buy"
                  ? "Where your receipt and order confirmation will land"
                  : "Where your quote and digital proof will land"
              }
              error={fieldErrors.email}
            >
              <input
                id="qf-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={fieldCls(fieldErrors.email)}
                placeholder="you@yourclub.com"
                value={c.email}
                onChange={setC1("email")}
              />
            </Field>
            <Field
              label="Country"
              required
              hint="Sets your shipping options and lead time"
              error={fieldErrors.country}
            >
              <input
                id="qf-country"
                className={fieldCls(fieldErrors.country)}
                placeholder="United Kingdom"
                autoComplete="country-name"
                value={c.country}
                onChange={setC1("country")}
              />
            </Field>
            <Field
              label="Phone"
              required
              hint="So we can reach you quickly about your order"
              error={fieldErrors.phone}
            >
              <input
                id="qf-phone"
                type="tel"
                autoComplete="tel"
                className={fieldCls(fieldErrors.phone)}
                placeholder="+44 7700 900123"
                value={c.phone}
                onChange={setC1("phone")}
              />
            </Field>
            <Field label="Club / organisation">
              <input
                id="qf-organization"
                className={fieldCls()}
                placeholder="Riverside Hockey Club"
                autoComplete="organization"
                value={c.organization}
                onChange={setC1("organization")}
              />
            </Field>
            <Field label="City">
              <input
                id="qf-city"
                className={fieldCls()}
                placeholder="Manchester"
                autoComplete="address-level2"
                value={c.city}
                onChange={setC1("city")}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* 3 — KIT */}
      <section>
        <Legend n="3" title="Your kit" />
        <div className="mt-5">
          {!customizeOpen ? (
            <div className="rounded-lg border border-line-strong bg-ink-2 p-5 sm:p-6">
              <p className="text-sm text-paper/75">
                <span className="font-semibold text-paper">
                  Not sure? We&apos;ll use our most popular setup:
                </span>{" "}
                {recommendedSummary}.
              </p>
              <button
                type="button"
                onClick={() => setCustomizeOpen(true)}
                className="mt-3 text-sm font-semibold text-volt link-underline"
              >
                Customize these choices
              </button>
            </div>
          ) : (
            <div className="space-y-5 rounded-lg border border-line-strong bg-ink-2 p-5 sm:p-6">
              <button
                type="button"
                onClick={() => setCustomizeOpen(false)}
                className="text-sm font-semibold text-volt link-underline"
              >
                ← Use the recommended setup instead
              </button>
              {groups.map((g) => {
                const recId = recommendedId(g);
                const showNotSure =
                  g.type === "single" && selections[g.id] !== recId;
                return (
                  <div key={g.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="field-label mb-0" id={`grp-${g.id}`}>{g.label}</p>
                      {showNotSure && (
                        <button
                          type="button"
                          onClick={() => setSingle(g.id, recId as string)}
                          className="text-xs font-semibold text-volt link-underline"
                        >
                          Not sure? Use our pick
                        </button>
                      )}
                    </div>
                    <div
                      className="mt-2 flex flex-wrap gap-2"
                      role="group"
                      aria-labelledby={`grp-${g.id}`}
                    >
                      {g.options.map((o) => {
                        const on =
                          g.type === "single"
                            ? selections[g.id] === o.id
                            : ((selections[g.id] as string[]) ?? []).includes(o.id);
                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() =>
                              g.type === "single"
                                ? setSingle(g.id, o.id)
                                : toggleMulti(g.id, o.id)
                            }
                            aria-pressed={on}
                            className={`rounded-[8px] border px-3.5 py-2 text-sm transition-colors ${
                              on
                                ? "border-volt bg-volt/10 text-paper"
                                : "border-line text-paper/65 hover:border-line-strong"
                            }`}
                          >
                            {g.type === "multi" ? (on ? "✓ " : "+ ") : ""}
                            {o.label}
                            {o.recommended ? (
                              <span className="ml-1.5 text-[0.65rem] uppercase tracking-wide text-volt/80">
                                Recommended
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4 — EXTRA DETAILS (sizes + roster, both optional, both deferred) */}
      <section>
        <Legend n="4" title="Extra details" />
        <div className="mt-5">
          {!detailsOpen ? (
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="text-sm font-semibold text-volt link-underline"
            >
              + Add exact sizes, player names &amp; numbers (optional)
            </button>
          ) : (
            <div className="space-y-6 rounded-lg border border-line-strong bg-ink-2 p-5 sm:p-6">
              {/* exact sizes */}
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="field-label mb-0" id="grp-sizes">
                    Quantity by size <span className="text-paper/55">(optional)</span>
                  </p>
                  <p className="text-xs text-paper/60" aria-live="polite">
                    Adds up to <span className="text-paper/80">{sizesTotal}</span>
                  </p>
                </div>
                <div
                  className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5"
                  role="group"
                  aria-labelledby="grp-sizes"
                >
                  {SIZES.map((s) => (
                    <label key={s} className="flex flex-col">
                      <span className="text-center text-[0.65rem] uppercase tracking-wide text-paper/60">
                        {s}
                      </span>
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        aria-label={`Quantity, size ${s}`}
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
                {sizesTotal > 0 && sizesTotal !== qty && (
                  <p className="mt-1.5 text-xs text-paper/60">
                    This adds up to {sizesTotal} — we&apos;ll confirm final sizes with
                    you before production.
                  </p>
                )}
              </div>

              {/* players */}
              <div className="border-t border-line pt-5">
                <div className="flex items-baseline justify-between">
                  <p className="field-label mb-0">
                    Player names &amp; numbers{" "}
                    <span className="text-paper/55">(optional)</span>
                  </p>
                  {players.length > 0 && (
                    <p className="text-xs text-paper/60">
                      {players.length} player{players.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>

                {players.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {players.map((p, i) => (
                      <li key={p.id} className="flex items-center gap-2">
                        <span className="w-6 shrink-0 text-center text-xs font-semibold text-paper/60">
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
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-[6px] border border-line text-paper/60 transition-colors hover:border-ember hover:text-ember"
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
          )}
        </div>
      </section>

      {/* 5 — REFERENCE */}
      <section>
        <Legend n="5" title="Reference design" />
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Do you have a design?">
            <button
              type="button"
              onClick={() => setNeedsDesignHelp(false)}
              aria-pressed={!needsDesignHelp}
              className={`rounded-[8px] border px-3.5 py-2 text-sm transition-colors ${
                !needsDesignHelp
                  ? "border-volt bg-volt/10 text-paper"
                  : "border-line text-paper/65 hover:border-line-strong"
              }`}
            >
              I have a design
            </button>
            <button
              type="button"
              onClick={() => setNeedsDesignHelp(true)}
              aria-pressed={needsDesignHelp}
              className={`rounded-[8px] border px-3.5 py-2 text-sm transition-colors ${
                needsDesignHelp
                  ? "border-volt bg-volt/10 text-paper"
                  : "border-line text-paper/65 hover:border-line-strong"
              }`}
            >
              I don&apos;t have a design yet — I need design help
            </button>
          </div>

          <div className="space-y-4 rounded-lg border border-line-strong bg-ink-2 p-5 sm:p-6">
          {needsDesignHelp ? (
            <p className="text-sm text-paper/70">
              No problem — add any colour or style ideas below and our studio
              will design your kit with you, no charge to get started.
            </p>
          ) : (
            <div>
              <p className="field-label" id="grp-file">Upload the design you have in mind</p>
              <label className="file-drop flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-line-strong bg-ink p-4 transition-colors hover:border-volt">
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*,.pdf,.ai,.eps"
                  onChange={onFile}
                  aria-labelledby="grp-file"
                  aria-describedby="file-status"
                  aria-invalid={fieldErrors.file ? true : undefined}
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
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-sm border border-line text-paper/60">
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
                  <span
                    id="file-status"
                    className="mt-0.5 block text-xs text-paper/60"
                    aria-live="polite"
                  >
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
                    <span role="alert" className="mt-0.5 block text-xs font-medium text-ember">
                      {fieldErrors.file}
                    </span>
                  )}
                </span>
              </label>
            </div>
          )}

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
        </div>
      </section>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-md border border-ember/40 bg-ember/10 px-4 py-3 text-sm font-medium text-ember"
        >
          {errorMsg}
        </p>
      )}

      <div>
        {mode === "buy" && (
          <div className="mb-5 rounded-lg border border-volt/40 bg-volt/5 p-5">
            <div className="flex items-baseline justify-between">
              <p className="kicker text-volt">{quote.tier.label} price</p>
              <p className="text-xs text-paper/60">{usd(quote.unitPriceDiscounted)} / unit</p>
            </div>
            <p className="mt-1 font-display text-3xl text-paper">{usd(quote.total)}</p>
            <p className="mt-1 text-xs text-paper/60">
              For {qty} units, all options included. Larger orders (
              {BULK_THRESHOLD}+ units) get better per-unit pricing via a free
              quote instead.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending" || isUploading}
          className="w-full rounded-[8px] bg-lime px-6 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-volt-ink transition-colors hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-10"
        >
          {status === "sending"
            ? "Sending…"
            : isUploading
              ? "Uploading design…"
              : mode === "buy"
                ? `Pay & secure my order — ${usd(quote.total)}`
                : "Get my free quote"}
        </button>
        <p className="mt-3 text-xs text-paper/60">
          {mode === "buy"
            ? `Secure checkout · No hidden fees · Confirmation within ${FACTS.quoteReplyDays} business day`
            : QUOTE_TRUST_LINE}
        </p>
      </div>
    </form>
  );
}

function Legend({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b-2 border-line-strong pb-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-lime font-display text-xl leading-none text-volt-ink">
        {n}
      </span>
      <h2 className="display-3 text-2xl font-bold text-paper sm:text-3xl">{title}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const uid = useId();
  const controlId =
    (isValidElement(children) &&
      (children.props as { id?: string }).id) ||
    `${uid}-field`;
  const hintId = `${uid}-hint`;
  const errId = `${uid}-err`;
  const describedBy =
    [error ? errId : null, hint && !error ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label htmlFor={controlId} className="mb-1.5 flex items-center gap-2">
        <span className="text-[0.82rem] font-semibold text-paper">{label}</span>
        {required ? (
          <span className="rounded-full bg-volt/15 px-1.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-volt">
            Required
          </span>
        ) : (
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-paper/55">
            Optional
          </span>
        )}
      </label>
      {isValidElement(children)
        ? cloneElement(
            children as ReactElement<Record<string, unknown>>,
            {
              id: controlId,
              "aria-invalid": error ? true : undefined,
              "aria-required": required || undefined,
              "aria-describedby": describedBy,
            }
          )
        : children}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-paper/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="mt-1.5 text-xs font-medium text-ember">
          {error}
        </p>
      )}
    </div>
  );
}
