import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/site/Eyebrow";
import SiteFooter from "@/components/site/SiteFooter";
import KnowledgeGraph from "@/components/graph/KnowledgeGraph";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Cipher probes, follows whatever works, and strings small weaknesses together until it has a way in worth telling you about.",
};

const SURFACES = [
  {
    label: "YOUR APPS",
    title: "Data that is not theirs",
    body: "Can someone read another customer’s records, or act as a user they are not?",
  },
  {
    label: "YOUR CLOUD",
    title: "Left open by mistake",
    body: "What is reachable that should not be, and what could someone reach from it?",
  },
  {
    label: "FORGOTTEN KIT",
    title: "Nobody owns it now",
    body: "Old servers and stale software still answering on the internet.",
  },
  {
    label: "THE PATHS BETWEEN",
    title: "Small becomes serious",
    body: "Where three minor problems add up to one full way in.",
    accent: "#8C1027",
  },
];

const STEPS = [
  {
    n: "01",
    tint: "#0F7B8A",
    title: "You point it somewhere",
    body: "Name something you own and who signs off on testing it. That is the whole setup.",
  },
  {
    n: "02",
    tint: "#3D4E9E",
    title: "It goes looking",
    body: "It maps what is actually there, including the things your inventory forgot about.",
  },
  {
    n: "03",
    tint: "#B5741A",
    title: "It proves each one",
    body: "Nothing reaches you until it has been reproduced. No maybes to chase down.",
  },
  {
    n: "04",
    tint: "#8C1027",
    title: "It remembers",
    body: "Next week it starts from everything it already knows, so it goes deeper instead of starting over.",
    accent: true,
  },
];

const GUARANTEES = [
  {
    lead: "Every action",
    body: "is written down in order, so you can show anyone exactly what happened.",
  },
  {
    lead: "Nothing off limits",
    body: "gets touched. It only ever reaches what you authorised, and refuses the rest.",
  },
  {
    lead: "No damage",
    body: "to your data or your uptime. Anything destructive is blocked before it runs.",
  },
  {
    lead: "No surprises",
    body: "at the end. You see the findings as they land, not weeks later in a PDF.",
    accent: true,
  },
];

export default function PlatformPage() {
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
              <Eyebrow>PROBES · CHAINS · PROVES · REMEMBERS</Eyebrow>
              <h1
                className="h1 h1--page reveal"
                style={{ maxWidth: 680, margin: "30px 0 28px" }}
              >
                It goes after you the way a{" "}
                <span className="mark">real attacker</span> would.
              </h1>
              <p className="lede" style={{ maxWidth: 560, marginBottom: 36 }}>
                Not a checklist. It probes, follows whatever works, and strings
                small weaknesses together until it has a way in worth telling you
                about.
              </p>
              <div className="actions">
                <Link href="/contact" className="btn">
                  START WITH ONE ASSET
                </Link>
                <Link href="/evidence" className="link-u">
                  SEE THE PROOF
                </Link>
              </div>
            </div>

            <div className="grid2">
              {SURFACES.map((c) => (
                <div
                  key={c.label}
                  className="tcard reveal lift"
                  style={{
                    ["--tc" as string]: c.accent ?? "var(--ink)",
                    ["--tc-label" as string]: c.accent ?? "var(--slate)",
                  }}
                >
                  <div className="tcard__label">{c.label}</div>
                  <div className="tcard__title">{c.title}</div>
                  <div className="tcard__body">{c.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- four steps ---------- */}
      <section className="sec sec--hair sec--paper">
        <div className="wrap pad">
          <div className="headrow" style={{ marginBottom: 44 }}>
            <div>
              <Eyebrow num="01">START TO FINISH</Eyebrow>
              <h2
                className="h2 h2--lg reveal"
                style={{ maxWidth: 680, marginTop: 26 }}
              >
                Four steps. You do the first one.
              </h2>
            </div>
            <p className="body" style={{ maxWidth: 320 }}>
              Everything after the handover happens without you, and you can watch
              all of it.
            </p>
          </div>

          <div className="cols cols--wide" style={{ ["--n" as string]: 4 }}>
            {STEPS.map((st) => (
              <div key={st.n} className="reveal lift">
                <div
                  style={{
                    width: 26,
                    height: 3,
                    background: st.tint,
                    marginBottom: 16,
                  }}
                />
                <div
                  className="mono"
                  style={{
                    fontSize: 24,
                    marginBottom: 14,
                    color: st.accent ? "var(--crimson)" : "var(--ink)",
                  }}
                >
                  {st.n}
                </div>
                <h3 className="h3" style={{ marginBottom: 11 }}>
                  {st.title}
                </h3>
                <p className="body" style={{ color: "var(--ink-soft)" }}>
                  {st.body}
                </p>
              </div>
            ))}
          </div>

          <div className="note" style={{ marginTop: 26 }}>
            <span className="diamond" />
            <p>
              Step four is the one nobody else does. A consultancy hands you a
              report and forgets your estate. This gets sharper every time it runs.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- nothing in the dark ---------- */}
      <section className="sec sec--hair sec--ink" data-hero-dark>
        <div className="wrap pad">
          <div
            className="split split--center"
            style={{
              ["--a" as string]: "0.9fr",
              ["--b" as string]: "1.3fr",
              ["--gap" as string]: "60px",
            }}
          >
            <div>
              <Eyebrow num="02" dark>
                NOTHING HAPPENS IN THE DARK
              </Eyebrow>
              <h2
                className="h2 h2--sm reveal"
                style={{ color: "var(--white)", margin: "26px 0 20px" }}
              >
                You can watch every move it makes.
              </h2>
              <p
                className="lede--tight"
                style={{ color: "var(--mute-2)", marginBottom: 26 }}
              >
                Including the moves it refused. When something would have damaged
                data, it stops and writes down why.
              </p>
              <Link href="/trust" className="link-u link-u--on-dark">
                HOW WE KEEP IT SAFE
              </Link>
            </div>

            <div className="grid2" style={{ ["--g" as string]: "18px" }}>
              {GUARANTEES.map((g) => (
                <div key={g.lead} className="dcard reveal">
                  <div
                    className="dcard__lead"
                    style={g.accent ? { color: "var(--rose-bright)" } : undefined}
                  >
                    {g.lead}
                  </div>
                  <div className="dcard__body">{g.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- knowledge graph ---------- */}
      <section className="sec sec--hair sec--alt">
        <div className="wrap pad">
          <div className="headrow" style={{ marginBottom: 32 }}>
            <div>
              <Eyebrow num="03">IT GETS SHARPER</Eyebrow>
              <h2
                className="h2 h2--sm reveal"
                style={{ maxWidth: 640, margin: "26px 0 16px" }}
              >
                It builds a picture of your estate and keeps it.
              </h2>
              <p
                className="lede--tight"
                style={{ maxWidth: 620, color: "var(--ink-soft)" }}
              >
                Click anything below to see how one weakness connects to the rest.
                This is why the sixth run finds more than the first.
              </p>
            </div>
            <div className="bullets">
              {[
                "The same problem is never reported twice",
                "A pattern found in one place is checked everywhere",
                "Fixes are verified on the next run automatically",
              ].map((b) => (
                <div className="bullet" key={b}>
                  <span className="diamond" />
                  <span className="bullet__text">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <KnowledgeGraph />
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section className="sec sec--ink" data-hero-dark>
        <div
          className="wrap pad headrow"
          style={{ alignItems: "center", gap: 44 }}
        >
          <div>
            <h2
              className="h2 h2--sm reveal"
              style={{ color: "var(--white)", marginBottom: 16 }}
            >
              Pick one asset. See what we find.
            </h2>
            <p
              className="lede--tight"
              style={{ color: "var(--mute-2)", maxWidth: 620 }}
            >
              You will have proven findings before your next standup, and a full
              record of everything we looked at.
            </p>
          </div>
          <Link href="/contact" className="btn btn--sm btn--on-dark">
            START WITH ONE ASSET
          </Link>
        </div>
      </section>

      <SiteFooter
        links={["OVERVIEW", "INTEGRATIONS", "EVIDENCE", "TRUST", "CONTACT"]}
      />
    </>
  );
}
