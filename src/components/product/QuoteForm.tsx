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
import { QUOTE_TRUST_LINE } from "@/lib/site";
import { useUploadThing } from "@/lib/uploadthing";
import type { OptionGroup, Sport } from "@/lib/types";

const MAX_FILE_MB = 8;

const DELIVERY_OPTIONS = [
  { id: "1week", label: "Within 1 week", desc: "Rush" },
  { id: "2weeks", label: "Within 2 weeks", desc: "Standard" },
  { id: "1month", label: "Within 1 month", desc: "Extended" },
];

/* Plain, classic form styling — deliberately not the site's branded look,
   so the buying form reads as a normal, familiar form: white background,
   black text, regular-weight headings, ordinary bordered inputs. */
const inputBase =
  "w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-black placeholder:text-gray-400 transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black";
const fieldCls = (err?: string) =>
  `${inputBase} ${err ? "border-red-500 bg-red-50" : ""}`;
const pillBase = "rounded-md border px-3.5 py-2 text-sm transition-colors";
const pillOn = "border-black bg-black text-white";
const pillOff = "border-gray-300 text-black hover:border-gray-400";
const stepBtn =
  "grid h-8 w-8 shrink-0 place-items-center rounded-md border border-gray-300 text-sm text-black transition-colors hover:border-black";
const cardCls = "rounded-md border border-gray-300 bg-white p-5 sm:p-6";

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

export function QuoteForm({ sport, fabric }: { sport: Sport; fabric: OptionGroup }) {
  const router = useRouter();
  const [fabricId, setFabricId] = useState<string>(fabric.defaultValue as string);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [delivery, setDelivery] = useState<string>("2weeks");
  const [needsDesignHelp, setNeedsDesignHelp] = useState(false);
  const [designNotes, setDesignNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);

  const [c, setC] = useState({
    contactName: "",
    email: "",
    phone: "",
    country: "",
  });

  const [status, setStatus] = useState<Status>("idle");
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

  const sizesTotal = useMemo(
    () => Object.values(sizes).reduce((a, b) => a + (Number(b) || 0), 0),
    [sizes]
  );

  function bumpSize(size: string, delta: number) {
    setSizes((p) => ({ ...p, [size]: Math.max(0, (p[size] ?? 0) + delta) }));
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
    if (sizesTotal < MIN_ORDER_QTY)
      e.sizes = `Minimum order is ${MIN_ORDER_QTY} units`;
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
      (["sizes", "contactName", "email", "phone", "country"] as const).find((k) => e[k]) ??
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
    fd.set("fabric", fabricId);
    fd.set("qty", String(sizesTotal));
    fd.set("sizes", JSON.stringify(sizes));
    fd.set("roster", serializeRoster(players));
    fd.set("delivery", delivery);
    fd.set("designHelp", needsDesignHelp ? "yes" : "");
    fd.set("designNotes", designNotes);
    fd.set("contactName", c.contactName);
    fd.set("email", c.email);
    fd.set("phone", c.phone);
    fd.set("country", c.country);
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
      const res = await fetch("/api/quote", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
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

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-black" role="status">
        <p className="text-sm font-medium text-gray-500">Request received</p>
        <h2 className="mt-2 font-sans text-2xl font-semibold normal-case leading-snug tracking-normal text-black">
          Thanks, {c.contactName.split(" ")[0] || "there"}.
        </h2>
        <p className="mt-3 text-gray-600">Taking you to your confirmation…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded-lg border border-gray-200 bg-white p-5 text-black sm:p-8"
    >
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

      {/* 1 — QUANTITY BY SIZE */}
      <section>
        <Legend n="1" title="How many do you need?" />
        <div className="mt-4">
          <div className={`space-y-6 ${cardCls}`}>
            <div>
              <div className="flex items-baseline justify-between" id="grp-sizes">
                <p className="text-sm font-medium text-black">Set your quantity by size</p>
                <p className="text-sm" aria-live="polite">
                  <span className="text-base font-semibold text-black">{sizesTotal}</span>{" "}
                  <span className="text-gray-500">units total</span>
                </p>
              </div>
              <div
                className="mt-3 flex flex-wrap gap-2"
                role="group"
                aria-labelledby="grp-sizes"
              >
                {SIZES.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2 py-1.5"
                  >
                    <span className="w-8 text-center text-xs font-medium text-gray-600">
                      {s}
                    </span>
                    <button
                      type="button"
                      aria-label={`Decrease size ${s} quantity`}
                      onClick={() => bumpSize(s, -1)}
                      className={stepBtn}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm tabular-nums text-black">
                      {sizes[s] ?? 0}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase size ${s} quantity`}
                      onClick={() => bumpSize(s, 1)}
                      className={stepBtn}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
              {fieldErrors.sizes ? (
                <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                  {fieldErrors.sizes}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">
                  A rough headcount is enough to start — exact sizes can be
                  confirmed with you later.
                </p>
              )}
            </div>

            {/* players */}
            <div className="border-t border-gray-200 pt-5">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-black">
                  Player names &amp; numbers{" "}
                  <span className="font-normal text-gray-500">(optional)</span>
                </p>
                {players.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {players.length} player{players.length === 1 ? "" : "s"}
                  </p>
                )}
              </div>

              {players.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {players.map((p, i) => (
                    <li key={p.id} className="flex items-center gap-2">
                      <span className="w-6 shrink-0 text-center text-xs font-medium text-gray-500">
                        {i + 1}
                      </span>
                      <input
                        value={p.name}
                        onChange={(e) => updatePlayer(p.id, { name: e.target.value })}
                        placeholder="Name on back"
                        aria-label={`Player ${i + 1} name`}
                        className={`${inputBase} min-w-0 flex-1`}
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
                        className={`${inputBase} !w-16 shrink-0 text-center`}
                      />
                      <button
                        type="button"
                        onClick={() => removePlayer(p.id)}
                        aria-label={`Remove player ${i + 1}`}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-gray-300 text-gray-500 transition-colors hover:border-red-400 hover:text-red-600"
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
                className="mt-3 inline-flex items-center gap-2.5 rounded-md border border-gray-300 py-2 pl-2 pr-4 text-sm font-medium text-black transition-colors hover:border-black"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gray-100 text-[0.72rem] font-semibold text-black">
                  {players.length + 1}
                </span>
                Add {players.length === 0 ? "new" : "another"} player
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — FABRIC */}
      <section>
        <Legend n="2" title="Fabric" />
        <div className={`mt-4 ${cardCls}`}>
          <p className="text-sm font-medium text-black" id="grp-fabric">{fabric.label}</p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="grp-fabric">
            {fabric.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setFabricId(o.id)}
                aria-pressed={fabricId === o.id}
                className={`${pillBase} ${fabricId === o.id ? pillOn : pillOff}`}
              >
                {o.label}
                {o.recommended ? (
                  <span
                    className={`ml-1.5 text-[0.65rem] uppercase tracking-wide ${
                      fabricId === o.id ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    Recommended
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          {fabric.options.find((o) => o.id === fabricId)?.desc && (
            <p className="mt-3 text-xs text-gray-500">
              {fabric.options.find((o) => o.id === fabricId)?.desc}
            </p>
          )}
        </div>
      </section>

      {/* 3 — DELIVERY */}
      <section>
        <Legend n="3" title="Estimated delivery" />
        <div className={`mt-4 ${cardCls}`}>
          <p className="text-sm text-gray-600">How soon do you need this order?</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Estimated delivery">
            {DELIVERY_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setDelivery(o.id)}
                aria-pressed={delivery === o.id}
                className={`${pillBase} ${delivery === o.id ? pillOn : pillOff}`}
              >
                {o.label}
                <span
                  className={`ml-1.5 text-[0.65rem] uppercase tracking-wide ${
                    delivery === o.id ? "text-white/70" : "text-gray-400"
                  }`}
                >
                  {o.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — REFERENCE */}
      <section>
        <Legend n="4" title="Reference design" />
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Do you have a design?">
            <button
              type="button"
              onClick={() => setNeedsDesignHelp(false)}
              aria-pressed={!needsDesignHelp}
              className={`${pillBase} ${!needsDesignHelp ? pillOn : pillOff}`}
            >
              I have a design
            </button>
            <button
              type="button"
              onClick={() => setNeedsDesignHelp(true)}
              aria-pressed={needsDesignHelp}
              className={`${pillBase} ${needsDesignHelp ? pillOn : pillOff}`}
            >
              I don&apos;t have a design yet — I need design help
            </button>
          </div>

          <div className={`space-y-4 ${cardCls}`}>
          {needsDesignHelp ? (
            <p className="text-sm text-gray-600">
              No problem — add any colour or style ideas below and our studio
              will design your kit with you, no charge to get started.
            </p>
          ) : (
            <div>
              <p className="text-sm font-medium text-black" id="grp-file">
                Upload the design you have in mind
              </p>
              <label className="mt-2 flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-gray-300 bg-white p-4 transition-colors hover:border-black">
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
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-sm border border-gray-300 text-gray-400">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 16V4m0 0 4 4m-4-4L8 8" />
                      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                    </svg>
                  </span>
                )}
                <span className="text-sm">
                  <span className="font-medium text-black">
                    {file ? file.name : "Choose a file"}
                  </span>
                  <span
                    id="file-status"
                    className="mt-0.5 block text-xs text-gray-500"
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
                      className="mt-0.5 block truncate text-xs text-black underline"
                    >
                      {referenceUrl}
                    </a>
                  )}
                  {fieldErrors.file && (
                    <span role="alert" className="mt-0.5 block text-xs font-medium text-red-600">
                      {fieldErrors.file}
                    </span>
                  )}
                </span>
              </label>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-black">
              Design notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              placeholder="Team colours (Pantone if you have them), sponsor placement, collar style, deadline, links to artwork…"
              className={`${inputBase} resize-none`}
            />
          </div>
          </div>
        </div>
      </section>

      {/* 5 — DETAILS */}
      <section>
        <Legend n="5" title="Your details" />
        <p className="mt-2 text-sm text-gray-600">
          So we can send your quote and proof back to you. We never share
          these or add you to a mailing list.
        </p>

        <div className={`mt-4 ${cardCls}`}>
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
              hint="Where your quote and digital proof will land"
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
                placeholder="+1 (555) 123-4567"
                value={c.phone}
                onChange={setC1("phone")}
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
                placeholder="United States"
                autoComplete="country-name"
                value={c.country}
                onChange={setC1("country")}
              />
            </Field>
          </div>
        </div>
      </section>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMsg}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "sending" || isUploading}
          className="w-full rounded-md bg-black px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 sm:w-auto sm:px-10"
        >
          {status === "sending"
            ? "Sending…"
            : isUploading
              ? "Uploading design…"
              : "Get my free quote"}
        </button>
        <p className="mt-3 text-xs text-gray-500">{QUOTE_TRUST_LINE}</p>
      </div>
    </form>
  );
}

function Legend({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-2 border-b border-gray-200 pb-2">
      <span className="text-sm font-medium text-gray-400">{n}.</span>
      <h2 className="font-sans text-xl font-semibold normal-case leading-snug tracking-normal text-black sm:text-2xl">
        {title}
      </h2>
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
      <label htmlFor={controlId} className="mb-1.5 flex items-center gap-1">
        <span className="text-sm font-medium text-black">{label}</span>
        {required && <span className="text-sm text-red-600">*</span>}
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
        <p id={hintId} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
