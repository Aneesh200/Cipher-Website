import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/site/Eyebrow";
import SiteFooter from "@/components/site/SiteFooter";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Trust",
  description:
    "Single tenant by default, encrypted at rest and in transit, never used to train a model, and every action replayable from the audit log.",
};

const PLEDGES = [
  {
    label: "ISOLATION",
    title: "Yours alone",
    body: "Your work never shares a boundary with another customer.",
  },
  {
    label: "ENCRYPTION",
    title: "Locked at rest",
    body: "Credentials are vaulted and the reasoning trail is stored encrypted.",
  },
  {
    label: "NO TRAINING",
    title: "Never pooled",
    body: "Not sold on, and never fed into any shared or third party model.",
    accent: "#8C1027",
  },
  {
    label: "YOUR CALL",
    title: "Delete anytime",
    body: "You set the retention window and can remove an engagement outright.",
  },
];

const COMMITMENTS = [
  {
    tint: "#0F7B8A",
    label: "ISOLATION",
    title: "Single tenant by default",
    body: "Your engagements, credentials and knowledge graph never share a boundary with another customer. There is no shared corpus into which your estate could leak, because the architecture does not have one.",
  },
  {
    tint: "#3D4E9E",
    label: "ENCRYPTION",
    title: "Encrypted at rest and in transit",
    body: "Credentials sit in a vault rather than in configuration, and the agent's reasoning trail is stored encrypted rather than as plain text, so a database copy is not a transcript of your weaknesses.",
  },
  {
    tint: "#8C1027",
    label: "NO TRAINING, NO RESALE",
    title: "Never used to improve a model",
    body: "Your findings are not pooled with other customers', not sold on as threat intelligence, and not fed back into any shared model. This is written into the agreement, not just the marketing.",
    labelAccent: true,
  },
  {
    tint: "#B5741A",
    label: "CUSTOMER CONTROL",
    title: "You set retention and deletion",
    body: "Choose the retention window, export what you need in a portable form, and delete an engagement and its graph outright at any time. Deletion removes the evidence too, not just the index.",
  },
];

const SCOPE_LOG: [string, boolean][] = [
  ["GET app.your-domain.com/api/v1/accounts", true],
  ["POST app.your-domain.com/login", true],
  ["GET unrelated-third-party.example/", false],
  ["DELETE app.your-domain.com/api/v1/accounts/1", false],
];

const GUARDS = [
  {
    title: "Hard scope enforcement",
    body: "Targets are resolved and pinned at provisioning. Requests to anything outside the authorised set are refused rather than warned about.",
  },
  {
    title: "Rebinding and drift protection",
    body: "A target that changes underneath the engagement cannot be used to redirect the agent at infrastructure you never authorised.",
  },
  {
    title: "Destructive action guards",
    body: "Operations that would damage data or disrupt availability are blocked by default, and every block is logged with its reason. Coverage is never traded for uptime.",
  },
  {
    title: "Complete, replayable audit log",
    body: "Every request, decision and refusal is written down in order, so you can prove exactly what was touched and when, to an auditor or to your own board.",
  },
];

const GET_BACK: [string, string, boolean?][] = [
  ["Scope document", "2 BUSINESS DAYS"],
  ["Safety constraints in writing", "WITH THE SCOPE"],
  ["First verified findings", "HOURS FROM START"],
  ["Audit log", "WITH EVERY RUN", true],
];

export default function TrustPage() {
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="sec sec--hair sec--paper sec--wash">
        <div className="washfill" />
        <div className="wrap">
          <div
            className="split split--center"
            style={{
              ["--a" as string]: "1.22fr",
              padding: "clamp(40px,4.6vw,64px) 0 clamp(34px,3.6vw,48px)",
            }}
          >
            <div>
              <Eyebrow>SINGLE TENANT · ENCRYPTED · NEVER USED FOR TRAINING</Eyebrow>
              <h1
                className="h1 h1--page reveal"
                style={{ maxWidth: 660, margin: "30px 0 26px" }}
              >
                Your findings are yours. <span className="mark">Nobody else</span>{" "}
                sees them.
              </h1>
              <p className="lede" style={{ maxWidth: 560, marginBottom: 34 }}>
                Letting something test your systems only works if the boundary
                around your data is absolute and the record of what it did is
                complete. Both are built in, not settings.
              </p>
              <div className="actions">
                <Link href="/contact" className="btn">
                  START WITH ONE ASSET
                </Link>
                <a href="#safety" className="link-u">
                  SEE THE LIMITS IT RESPECTS
                </a>
              </div>
            </div>

            <div className="grid2">
              {PLEDGES.map((p) => (
                <div
                  key={p.label}
                  className="tcard reveal lift"
                  style={{
                    ["--tc" as string]: p.accent ?? "var(--ink)",
                    ["--tc-label" as string]: p.accent ?? "var(--slate)",
                  }}
                >
                  <div className="tcard__label">{p.label}</div>
                  <div className="tcard__title">{p.title}</div>
                  <div className="tcard__body">{p.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- four commitments ---------- */}
      <section className="sec sec--hair sec--paper">
        <div className="wrap pad-sm">
          <Eyebrow num="01">DATA HANDLING</Eyebrow>
          <h2 className="h2 h2--xs reveal" style={{ maxWidth: 700, margin: "34px 0 40px" }}>
            Four commitments.
          </h2>
          <div className="grid2" style={{ ["--g" as string]: "20px" }}>
            {COMMITMENTS.map((c) => (
              <div
                key={c.label}
                className={`${s.commit} reveal lift`}
                style={{
                  ["--tc" as string]: c.tint,
                  ["--tc-label" as string]: c.labelAccent
                    ? "var(--crimson)"
                    : "var(--ink)",
                }}
              >
                <span className={s.commitLabel}>{c.label}</span>
                <h3 className={s.commitTitle}>{c.title}</h3>
                <p className="body" style={{ lineHeight: 1.6, color: "var(--ink-soft)" }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- safety model ---------- */}
      <section id="safety" className="sec sec--hair sec--ink" data-hero-dark>
        <div className="wrap pad-sm">
          <Eyebrow num="02" dark>
            SAFETY MODEL
          </Eyebrow>

          <div
            className="split split--start"
            style={{
              ["--a" as string]: "0.82fr",
              ["--b" as string]: "1.18fr",
              marginTop: 34,
            }}
          >
            <div>
              <h2
                className="h2 h2--xs reveal"
                style={{ color: "var(--white)", marginBottom: 20 }}
              >
                The agent cannot exceed what you authorised.
              </h2>
              <p
                className="body"
                style={{ lineHeight: 1.62, color: "var(--mute-2)", marginBottom: 26 }}
              >
                Scope is not advisory. Every outbound request is checked against the
                authorised set before it is issued, and refusals are recorded
                alongside successes.
              </p>

              <div className={s.scope}>
                <div className={s.scopeHead}>
                  <span>SCOPE CHECK</span>
                  <span>AUDIT LOG</span>
                </div>
                <div className={s.scopeRows}>
                  {SCOPE_LOG.map(([req, allow], i) => (
                    <div
                      key={req}
                      className={`${s.scopeRow}${allow ? "" : ` ${s["is-blocked"]}`} line-in`}
                      style={{ animationDelay: `${0.05 + i * 0.3}s` }}
                    >
                      <code>{req}</code>
                      <span
                        className={`${s.verdict} ${
                          allow ? s["verdict--allow"] : s["verdict--block"]
                        }`}
                      >
                        {allow ? "ALLOW" : "BLOCK"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={s.scopeFoot}>
                  2 REFUSED · OUT OF SCOPE HOST · DESTRUCTIVE ACTION · BOTH LOGGED
                  WITH REASON
                </div>
              </div>
            </div>

            <div className={s.guards}>
              {GUARDS.map((g) => (
                <div key={g.title} className="reveal">
                  <b>{g.title}</b>
                  <p className="body" style={{ lineHeight: 1.6, color: "var(--mute-2)" }}>
                    {g.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- start with one asset ---------- */}
      <section className="sec sec--hair sec--paper">
        <div
          className="wrap pad-sm split split--center"
          style={{ ["--a" as string]: "1.1fr", ["--gap" as string]: "60px" }}
        >
          <div>
            <h2 className="h2 h2--xs reveal" style={{ marginBottom: 16 }}>
              Start with one of your assets.
            </h2>
            <p
              className="body"
              style={{ lineHeight: 1.62, color: "var(--ink-soft)", maxWidth: 520, marginBottom: 26 }}
            >
              The enquiry form asks only what we need to write a scope: the asset,
              the surface it sits on, and who authorises testing on it.
            </p>
            <Link href="/contact" className="btn btn--sm btn--deepen">
              GO TO CONTACT
            </Link>
          </div>

          <div className={s.getback}>
            <div className="kicker" style={{ fontSize: 11, letterSpacing: "0.16em", marginBottom: 20 }}>
              WHAT YOU GET BACK
            </div>
            <div className="rows rows--capped">
              {GET_BACK.map(([k, v, alert]) => (
                <div key={k}>
                  <span className="rows__k" style={{ color: "var(--ink-soft)" }}>
                    {k}
                  </span>
                  <span
                    className="rows__v"
                    style={{ color: alert ? "var(--crimson)" : "var(--ink)" }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <p className="small"
              style={{ color: "var(--mute)", marginTop: 18 }}>
              Nothing you submit is shared outside Cipher, and enquiry details are
              never used to train a model.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter
        tagline="Cipher is the platform. Orwell is the analyst."
        links={["OVERVIEW", "PLATFORM", "INTEGRATIONS", "EVIDENCE", "CONTACT"]}
      />
    </>
  );
}
