import nodemailer from "nodemailer";

/**
 * Thrown when SMTP env vars are missing. Routes catch this and return a
 * "mailbox not configured" response instead of a generic 500.
 */
export class MailNotConfiguredError extends Error {
  constructor() {
    super("SMTP env vars are not set — see .env.example");
    this.name = "MailNotConfiguredError";
  }
}

export interface Mailer {
  transporter: nodemailer.Transporter;
  /** From: address for outgoing mail. */
  from: string;
  /** One or more studio inbox addresses (QUOTE_TO_EMAIL, comma-separated). */
  studioAddresses: string[];
}

/**
 * Build a nodemailer transport from environment. Both the quote and contact
 * routes share this so there is one SMTP configuration, not two.
 */
export function getMailer(): Mailer {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    QUOTE_TO_EMAIL,
    QUOTE_FROM_EMAIL,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !QUOTE_TO_EMAIL) {
    throw new MailNotConfiguredError();
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return {
    transporter,
    from: QUOTE_FROM_EMAIL || SMTP_USER,
    studioAddresses: QUOTE_TO_EMAIL.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

/* ------------------------------------------------------------------ *
   Lightweight, dependency-free spam defence shared by the public forms.
 * ------------------------------------------------------------------ */

/** In-memory sliding-window rate limit. Per serverless instance — a coarse
 *  first line of defence, not a guarantee. */
const HITS = new Map<string, number[]>();

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 10 * 60_000 } = {}
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const fresh = (HITS.get(key) ?? []).filter((t) => now - t < windowMs);
  if (fresh.length >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((windowMs - (now - fresh[0])) / 1000),
    };
  }
  fresh.push(now);
  HITS.set(key, fresh);
  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Heuristic spam check for a free-text submission.
 * - `honeypot`: a hidden field real users never fill.
 * - `elapsedMs`: time between form render and submit; humans take > ~2.5s.
 * - link flooding in the body.
 */
export function looksLikeSpam(opts: {
  honeypot?: string;
  elapsedMs?: number;
  text?: string;
}): boolean {
  if (opts.honeypot && opts.honeypot.trim() !== "") return true;
  if (typeof opts.elapsedMs === "number" && opts.elapsedMs >= 0 && opts.elapsedMs < 2500)
    return true;
  if (opts.text) {
    const links = (opts.text.match(/https?:\/\//gi) ?? []).length;
    if (links >= 4) return true;
    if (/\[url=|\bviagra\b|\bcasino\b|\bseo services\b/i.test(opts.text)) return true;
  }
  return false;
}

export function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
  );
}
