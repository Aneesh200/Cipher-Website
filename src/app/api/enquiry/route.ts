import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL, HONEYPOT_FIELD, TURNSTILE_ACTION } from "@/lib/enquiry";

export const runtime = "nodejs";
// A Turnstile siteverify call (capped at 5s) plus Gmail's SMTP handshake and a
// send can run past the default 10s ceiling on a cold start or a slow relay.
export const maxDuration = 30;

// Credentials come from the environment — never hardcoded. Set EMAIL_USER /
// EMAIL_PASS (a Gmail app password) and optionally CONTACT_RECIPIENT.
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECIPIENT = process.env.CONTACT_RECIPIENT || EMAIL_USER || CONTACT_EMAIL;

type Enquiry = {
  name?: unknown;
  email?: unknown;
  organisation?: unknown;
  role?: unknown;
  asset?: unknown;
  surface?: unknown;
  timing?: unknown;
  authoriser?: unknown;
  notes?: unknown;
  /** Cloudflare Turnstile token from the form widget. */
  turnstileToken?: unknown;
  /** Honeypot: hidden from people, filled in by naive form bots. */
  [HONEYPOT_FIELD]?: unknown;
};

/* ---------------------------------------------------------------------------
   Input hardening

   Everything in the body is attacker-controlled. Two distinct hazards:

   1. Address fields. nodemailer parses `to` / `replyTo` as an RFC 5322 address
      LIST, so one submitted string is not necessarily one recipient. A comma
      appends recipients and RFC 5322 group syntax ("x:evil@y.z;") replaces them.
      ADDRESS_RE therefore matches a single bare addr-spec and nothing else: no
      commas, colons, semicolons, angle brackets, quotes, whitespace or control
      characters.

   2. Body fields. Anything interpolated into the HTML mail is escaped, or a
      submission can inject markup and links into a message our own team reads.

   Header-bound values are additionally stripped of control characters. nodemailer
   already folds CR/LF when it builds MIME headers, so that part is defence in
   depth rather than the thing preventing header injection.
--------------------------------------------------------------------------- */

const LIMITS = {
  name: 120,
  email: 254, // RFC 5321 maximum path length
  organisation: 160,
  role: 80,
  asset: 300,
  surface: 80,
  timing: 80,
  authoriser: 160,
  notes: 5000,
} as const;

const ADDRESS_RE =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

const CONTROL_CHARS = /[\x00-\x1F\x7F]/g;

const str = (v: unknown): string => (typeof v === "string" ? v : "");

function isEmailAddress(value: string): boolean {
  return value.length <= LIMITS.email && ADDRESS_RE.test(value);
}

/** Strip control characters, collapse whitespace, cap length. */
function headerSafe(value: string, max: number): string {
  return value.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Cap length and drop control characters, keeping the author's line breaks. */
function bodySafe(value: string, max: number): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, max);
}

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);
}

/* ---------------------------------------------------------------------------
   Rate limiting

   Fixed-window counter per client IP, held in process memory. On serverless each
   instance keeps its own tally, so a distributed flood can still exceed
   WINDOW_MAX in aggregate. This makes casual abuse cost real effort; Turnstile
   below is what stops a determined one.
--------------------------------------------------------------------------- */

const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_MAX = 5;
const MAX_TRACKED_IPS = 5000;

const hits = new Map<string, number[]>();

/** Seconds the caller should wait, or 0 when the request is within budget. */
function rateLimit(ip: string): number {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  if (hits.size > MAX_TRACKED_IPS) {
    // Deleting during forEach is safe on a Map.
    hits.forEach((times, key) => {
      if (times.every((t) => t <= cutoff)) hits.delete(key);
    });
  }

  const recent = (hits.get(ip) || []).filter((t) => t > cutoff);

  if (recent.length >= WINDOW_MAX) {
    hits.set(ip, recent);
    return Math.max(1, Math.ceil((recent[0] + WINDOW_MS - now) / 1000));
  }

  recent.push(now);
  hits.set(ip, recent);
  return 0;
}

/* ---------------------------------------------------------------------------
   Bot defences (AUT-1510, mirroring authify.tech's AUT-1303)

   In the order the handler applies them:

   1. Content-Type and, in production, Origin. Both are trivially forged, but they
      shed scripts that don't bother.
   2. Honeypot field. Hidden from people and assistive tech; bots that fill every
      input reveal themselves. They get a fake success so they don't adapt.
   3. Cloudflare Turnstile, verified server-side. Enforced whenever
      TURNSTILE_SECRET_KEY is set, which requires NEXT_PUBLIC_TURNSTILE_SITE_KEY
      at build time too or the form has no widget and every lead is refused.

   Every request is logged with its network signals (IP, Vercel geo headers, JA4
   TLS fingerprint, user agent) and the same signals are appended to the team
   notification. Vercel keeps runtime logs for hours; Gmail keeps the
   notification indefinitely, so the inbox doubles as the evidence log.

   There is deliberately no acknowledgement mail to the submitted address. It
   let anyone make our mailbox send branded mail carrying their text to any
   inbox, and bounces from fake addresses erode sender reputation.
--------------------------------------------------------------------------- */

const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

// Every custom domain on the Vercel project. The apex only redirects to www, so
// no form is served from it, but a redirect change shouldn't refuse leads.
const PRODUCTION_HOSTS = ["www.ciphersecurity.ai", "ciphersecurity.ai", "cipher.authify.tech"];
const ALLOWED_ORIGINS = new Set(PRODUCTION_HOSTS.map((h) => `https://${h}`));
const TURNSTILE_HOSTNAMES = new Set(PRODUCTION_HOSTS);

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_TOKEN_MAX = 2048;

type RequestMeta = {
  ip: string;
  location: string;
  ja4: string;
  userAgent: string;
  origin: string;
  referer: string;
  secFetchSite: string;
  acceptLanguage: string;
  host: string;
  vercelId: string;
};

function header(req: Request, name: string, decode = false): string {
  let raw = req.headers.get(name) ?? "";
  if (decode) {
    // Vercel URI-encodes x-vercel-ip-city; a malformed value is kept as sent.
    try {
      raw = decodeURIComponent(raw);
    } catch {}
  }
  // Sanitise after decoding, so an encoded %0A can't become a raw newline.
  return headerSafe(raw, 300);
}

function requestMeta(req: Request): RequestMeta {
  const location = [
    header(req, "x-vercel-ip-city", true),
    header(req, "x-vercel-ip-country-region"),
    header(req, "x-vercel-ip-country"),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    // Vercel overwrites x-real-ip with the connecting client's address.
    ip:
      header(req, "x-real-ip") ||
      header(req, "x-forwarded-for").split(",")[0].trim() ||
      "unknown",
    location,
    ja4: header(req, "x-vercel-ja4-digest"),
    userAgent: header(req, "user-agent"),
    origin: header(req, "origin"),
    referer: header(req, "referer"),
    secFetchSite: header(req, "sec-fetch-site"),
    acceptLanguage: header(req, "accept-language"),
    host: header(req, "host"),
    vercelId: header(req, "x-vercel-id"),
  };
}

/** One JSON line per request, so the logs can be filtered on `evt`. */
function logRequest(outcome: string, meta: RequestMeta, extra: Record<string, string> = {}) {
  console.log(JSON.stringify({ evt: "enquiry_api", outcome, ...meta, ...extra }));
}

/** Failure reason, or null when the token is valid. */
async function verifyTurnstile(token: unknown, ip: string): Promise<string | null> {
  if (typeof token !== "string" || !token || token.length > TURNSTILE_TOKEN_MAX) {
    return "missing-token";
  }

  try {
    const reply = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const result = (await reply.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
      "error-codes"?: string[];
    };

    if (!result.success) return (result["error-codes"] || []).join(",") || "rejected";
    // Cloudflare's test keys (used on previews) report no action and hostname
    // example.com, so these only bind in production — where a test key fails here.
    if (IS_PRODUCTION) {
      if (result.action !== TURNSTILE_ACTION) return "wrong-action";
      if (!TURNSTILE_HOSTNAMES.has(result.hostname || "")) return "wrong-hostname";
    }
    return null;
  } catch {
    return "siteverify-unreachable";
  }
}

/**
 * The shape of the authify.tech flood (AUT-1303): a capitalised gibberish word
 * plus " LLC" and a one-word name. Real companies match this too, so it only
 * tags the notification subject; it never drops a submission.
 */
const FLOOD_COMPANY_RE = /^[A-Z][a-z]{3,12} LLC$/;

function looksLikeFlood(name: string, organisation: string): boolean {
  return FLOOD_COMPANY_RE.test(organisation) && !/\s/.test(name);
}

const fail = (status: number, error: string, headers?: HeadersInit) =>
  NextResponse.json({ success: false, error }, { status, headers });

const line = (k: string, v: string) => `
  <tr>
    <td style="padding:9px 0;border-top:1px solid #E4E7EC;color:#5A6473;font-size:13px;font-family:'IBM Plex Mono',monospace;letter-spacing:0.06em;">${esc(k)}</td>
    <td style="padding:9px 0 9px 20px;border-top:1px solid #E4E7EC;color:#11161C;font-size:15px;">${esc(v || "Not provided")}</td>
  </tr>`;

export async function POST(req: Request) {
  const meta = requestMeta(req);

  if (!(req.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
    logRequest("bad-content-type", meta);
    return fail(415, "Unsupported content type.");
  }

  if (IS_PRODUCTION && !ALLOWED_ORIGINS.has(meta.origin)) {
    logRequest("bad-origin", meta);
    return fail(403, "Forbidden.");
  }

  const retryAfter = rateLimit(meta.ip);
  if (retryAfter) {
    logRequest("rate-limited", meta);
    return fail(429, "Too many requests from this address. Please try again shortly.", {
      "Retry-After": String(retryAfter),
    });
  }

  let body: Enquiry;
  try {
    const parsed: unknown = await req.json();
    body = parsed && typeof parsed === "object" ? (parsed as Enquiry) : {};
  } catch {
    logRequest("malformed", meta);
    return fail(400, "Malformed request.");
  }

  const email = str(body.email).trim();
  const name = headerSafe(str(body.name), LIMITS.name);
  const organisation = headerSafe(str(body.organisation), LIMITS.organisation);
  const role = headerSafe(str(body.role), LIMITS.role);
  const asset = headerSafe(str(body.asset), LIMITS.asset);
  const surface = headerSafe(str(body.surface), LIMITS.surface);
  const timing = headerSafe(str(body.timing), LIMITS.timing);
  const authoriser = headerSafe(str(body.authoriser), LIMITS.authoriser);
  const notes = bodySafe(str(body.notes), LIMITS.notes);

  if (str(body[HONEYPOT_FIELD]).trim()) {
    // Keep enough to recover a real lead if a browser autofill ever trips this.
    logRequest("honeypot", meta, { email: email.slice(0, LIMITS.email), name, organisation, asset });
    return NextResponse.json({ success: true });
  }

  if (!isEmailAddress(email)) {
    logRequest("invalid-email", meta);
    return fail(400, "Please provide a valid work email address.");
  }
  if (!name) {
    logRequest("missing-name", meta);
    return fail(400, "Please provide your name.");
  }
  if (!asset) {
    logRequest("missing-asset", meta);
    return fail(400, "Please name the asset you want assessed.");
  }

  let turnstile = "not enforced";
  if (TURNSTILE_SECRET) {
    const failure = await verifyTurnstile(body.turnstileToken, meta.ip);
    if (failure) {
      logRequest("turnstile-failed", meta, { reason: failure });
      return fail(
        403,
        `We could not verify this request. Please retry, or email ${CONTACT_EMAIL} directly.`
      );
    }
    turnstile = "passed";
  }

  if (!EMAIL_USER || !EMAIL_PASS) {
    logRequest("mail-not-configured", meta);
    console.error("Enquiry API: EMAIL_USER / EMAIL_PASS not configured.");
    return fail(
      503,
      `The enquiry channel is not configured. Please email ${CONTACT_EMAIL} directly.`
    );
  }

  // Built here, not taken from the client, so a scripted caller can't choose it.
  const flagged = looksLikeFlood(name, organisation);
  const subject = `${flagged ? "[SPAM?] " : ""}Cipher enquiry: ${asset}${organisation ? ` — ${organisation}` : ""}`;

  const fields: [string, string][] = [
    ["name", name],
    ["email", email],
    ["organisation", organisation],
    ["role", role],
    ["asset", asset],
    ["surface", surface],
    ["timing", timing],
    ["authoriser", authoriser],
  ];

  const source: [string, string][] = [
    ["IP", meta.ip],
    ["Location", meta.location],
    ["JA4", meta.ja4],
    ["User agent", meta.userAgent],
    ["Origin", meta.origin],
    ["Referer", meta.referer],
    ["Sec-Fetch-Site", meta.secFetchSite],
    ["Accept-Language", meta.acceptLanguage],
    ["Host", meta.host],
    ["Vercel ID", meta.vercelId],
    ["Turnstile", turnstile],
  ];
  const sourceText = source.map(([k, v]) => `${k}: ${v || "-"}`).join("\n");
  const sourceHtml = source
    .map(([k, v]) => `<p style="margin:2px 0;">${esc(k)}: ${esc(v || "-")}</p>`)
    .join("");

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  try {
    await transporter.sendMail({
      to: RECIPIENT,
      from: EMAIL_USER,
      replyTo: email,
      subject: headerSafe(subject, 240),
      text: [
        "New Cipher engagement enquiry",
        "",
        ...fields.map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v || "Not provided"}`),
        "",
        "Notes:",
        notes || "None",
        "",
        "-- Request source (for abuse triage) --",
        sourceText,
      ].join("\n"),
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:640px;margin:0 auto;background:#FBFBFA;color:#11161C;">
          <div style="background:#11161C;padding:20px 28px;">
            <span style="display:inline-block;width:10px;height:10px;background:#8C1027;transform:rotate(45deg);"></span>
            <span style="color:#FFFFFF;font-family:'IBM Plex Mono',monospace;letter-spacing:0.16em;font-size:14px;margin-left:10px;">CIPHER</span>
            <span style="color:#8A93A0;font-family:'IBM Plex Mono',monospace;letter-spacing:0.14em;font-size:11px;margin-left:8px;">// ENGAGEMENT ENQUIRY</span>
          </div>
          <div style="padding:28px;">
            <h2 style="margin:0 0 6px;font-size:24px;font-weight:500;letter-spacing:-0.02em;">${esc(name)} wants an asset assessed</h2>
            <p style="margin:0 0 22px;color:#5A6473;font-size:15px;">Reply directly to this email to reach them.</p>
            <table style="width:100%;border-collapse:collapse;border-bottom:1px solid #11161C;">
              ${fields.map(([k, v]) => line(k, v)).join("")}
            </table>
            <p style="margin:22px 0 8px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#8A93A0;">ANYTHING WE SHOULD KNOW</p>
            <p style="margin:0;background:#F4F4F2;border-left:2px solid #8C1027;padding:14px 16px;white-space:pre-wrap;font-size:15px;line-height:1.6;color:#3E4855;">${esc(notes || "Nothing added.")}</p>
            <div style="margin-top:28px;padding-top:14px;border-top:1px solid #E4E7EC;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#8A93A0;">
              <p style="margin:0 0 6px;letter-spacing:0.14em;">REQUEST SOURCE (FOR ABUSE TRIAGE)</p>
              ${sourceHtml}
            </div>
          </div>
        </div>`,
    });
  } catch (error) {
    // Never hand the caller the SMTP server's reply: it leaks provider detail.
    console.error("Enquiry API: team notification failed:", error);
    logRequest("send-failed", meta);
    return fail(502, `We could not send that just now. Please email ${CONTACT_EMAIL} directly.`);
  }

  logRequest(flagged ? "delivered-flagged" : "delivered", meta);
  return NextResponse.json({ success: true });
}
