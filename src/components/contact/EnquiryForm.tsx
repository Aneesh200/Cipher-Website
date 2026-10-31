"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import s from "@/app/contact/page.module.css";
import { CONTACT_EMAIL, HONEYPOT_FIELD, TURNSTILE_ACTION } from "@/lib/enquiry";

const ROLES = [
  "Security engineering",
  "Engineering leadership",
  "Compliance or risk",
  "Founder or executive",
  "Other",
];

const SURFACES = [
  "Application or API",
  "Cloud accounts",
  "Network and hosts",
  "All three",
];

const TIMING = ["This week", "This month", "This quarter", "Evaluating only"];

// Cloudflare Turnstile. Inlined at build time; with no key the widget is skipped
// and the server must not be enforcing it either (see app/api/enquiry/route.ts).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "light";
      size: "flexible";
      "response-field": boolean;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
// How long to wait for the widget before offering the email fallback.
const TURNSTILE_WATCHDOG_MS = 15000;

// One load per page, shared across remounts. next/script's onReady/onError
// don't fire again for a component that remounts mid-load or after a blocked
// load, which leaves the submit button dead, so the script is added by hand.
let turnstileLoad: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!turnstileLoad) {
    turnstileLoad = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.onload = () =>
        window.turnstile ? resolve() : reject(new Error("turnstile missing"));
      script.onerror = () => {
        // Forget the failure so a later visit to the page can try again.
        script.remove();
        turnstileLoad = null;
        reject(new Error("turnstile blocked"));
      };
      document.head.appendChild(script);
    });
  }
  return turnstileLoad;
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className={s.field}>
      <span>{label}</span>
      <select name={name} defaultValue={options[0]}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

/** The server's error message, or null when the enquiry went through. */
async function send(payload: Record<string, unknown>): Promise<string | null> {
  let res: Response;
  try {
    res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Only a genuine transport failure lands here — offline, DNS, or the
    // request being cut off mid-flight.
    return `The connection dropped before that sent. Please try again, or email ${CONTACT_EMAIL}.`;
  }

  // A protected preview, a redeploy swapping under us, or a gateway timeout
  // answers with HTML, so the body is parsed defensively and the status is
  // reported rather than being reduced to a generic network message.
  let json: { success?: boolean; error?: string } | null = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || !json?.success) {
    return (
      json?.error ||
      `That did not go through (error ${res.status}). Please try again, or email ${CONTACT_EMAIL}.`
    );
  }
  return null;
}

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const sent = status === "sent";
  const sending = status === "sending";
  const awaitingCheck = !!TURNSTILE_SITE_KEY && !turnstileToken;

  const renderTurnstile = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !window.turnstile || !turnstileRef.current || widgetId.current) {
      return;
    }
    widgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      action: TURNSTILE_ACTION,
      theme: "light",
      size: "flexible",
      // The token is sent explicitly, so no hidden input is needed in the form.
      "response-field": false,
      callback: (token) => {
        setTurnstileToken(token);
        setTurnstileFailed(false);
      },
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => {
        setTurnstileToken("");
        setTurnstileFailed(true);
      },
    });
  }, []);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let active = true;

    // A proxy that stalls the script never fires an error, so don't wait forever.
    const watchdog = window.setTimeout(() => {
      if (active && !widgetId.current) setTurnstileFailed(true);
    }, TURNSTILE_WATCHDOG_MS);

    loadTurnstile().then(
      () => {
        if (active) renderTurnstile();
      },
      () => {
        if (active) setTurnstileFailed(true);
      }
    );

    return () => {
      active = false;
      window.clearTimeout(watchdog);
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [renderTurnstile]);

  // Tokens are single-use, so every submit attempt needs a fresh one.
  const resetTurnstile = () => {
    if (!TURNSTILE_SITE_KEY) return;
    setTurnstileToken("");
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || sent || awaitingCheck) return;

    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setError("");

    const failure = await send({ ...data, turnstileToken });
    resetTurnstile();

    if (failure) {
      setError(failure);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.formHead}>
        <span>ENGAGEMENT ENQUIRY</span>
        <span className={`${s.status}${sent ? ` ${s["is-sent"]}` : ""}`}>
          {sent ? "RECEIVED" : "ACCEPTING ENQUIRIES"}
        </span>
      </div>

      <div className={s.fields}>
        <div className={s.pair}>
          <label className={s.field}>
            <span>FULL NAME</span>
            <input type="text" name="name" placeholder="Jane Okafor" required />
          </label>
          <label className={s.field}>
            <span>WORK EMAIL</span>
            <input
              type="email"
              name="email"
              placeholder="jane@company.com"
              required
            />
          </label>
        </div>

        <div className={s.pair}>
          <label className={s.field}>
            <span>ORGANISATION</span>
            <input type="text" name="organisation" placeholder="Company name" />
          </label>
          <Select label="YOUR ROLE" name="role" options={ROLES} />
        </div>

        <label className={s.field}>
          <span>ASSET TO ASSESS FIRST</span>
          <input
            type="text"
            name="asset"
            placeholder="app.your-domain.com, or a cloud account you own"
            required
          />
        </label>

        <div className={s.pair}>
          <Select label="SURFACE" name="surface" options={SURFACES} />
          <Select
            label="WHEN YOU WANT TO START"
            name="timing"
            options={TIMING}
          />
        </div>

        <label className={s.field}>
          <span>WHO AUTHORISES TESTING ON IT</span>
          <input type="text" name="authoriser" placeholder="Name and role" />
        </label>

        <label className={s.field}>
          <span>ANYTHING WE SHOULD KNOW</span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Constraints, maintenance windows, prior assessments"
          />
        </label>

        {/* Honeypot. Off-screen rather than display:none, which some bots skip. */}
        <div className={s.honeypot} aria-hidden="true">
          <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
          <input
            type="text"
            id={HONEYPOT_FIELD}
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {TURNSTILE_SITE_KEY && (
          <div className={s.turnstile}>
            <div ref={turnstileRef} />
            {turnstileFailed ? (
              <p className={`${s.turnstileNote} ${s["is-error"]}`}>
                The verification check could not load on this network. Please
                email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
                directly.
              </p>
            ) : (
              !turnstileToken && (
                <p className={s.turnstileNote}>Verifying your browser…</p>
              )
            )}
          </div>
        )}

        <div className={s.submitRow}>
          <button
            type="submit"
            className="btn btn--sm btn--deepen"
            disabled={sending || sent || awaitingCheck}
          >
            {sent ? "ENQUIRY SENT" : sending ? "SENDING…" : "SUBMIT ENQUIRY"}
          </button>
          <span
            className={`${s.submitNote}${status === "error" ? ` ${s["is-error"]}` : ""}`}
            role="status"
            aria-live="polite"
          >
            {status === "error"
              ? error
              : sent
                ? "Received. You will have a scope document within two business days."
                : "We reply within two business days with a scope document, not a sales sequence."}
          </span>
        </div>
      </div>
    </form>
  );
}
