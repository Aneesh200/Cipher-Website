"use client";

import { useState } from "react";
import s from "@/app/contact/page.module.css";

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

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const sent = status === "sent";
  const sending = status === "sending";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || sent) return;

    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setError("");

    let res: Response;
    try {
      res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Only a genuine transport failure lands here — offline, DNS, or the
      // request being cut off mid-flight.
      setError(
        "The connection dropped before that sent. Please try again, or email contact@authify.tech."
      );
      setStatus("error");
      return;
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
      setError(
        json?.error ||
          `That did not go through (error ${res.status}). Please try again, or email contact@authify.tech.`
      );
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

        <div className={s.submitRow}>
          <button
            type="submit"
            className="btn btn--sm btn--deepen"
            disabled={sending || sent}
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
