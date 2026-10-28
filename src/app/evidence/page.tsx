import type { Metadata } from "next";
import Link from "next/link";
import { APP_URL } from "@/lib/nav";
import Eyebrow from "@/components/site/Eyebrow";
import SiteFooter from "@/components/site/SiteFooter";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Evidence",
  description:
    "Every number here came from a run. Benchmark coverage, velocity across a live estate, and a like-for-like comparison.",
};

const HERO_STATS = [
  {
    value: "1,000+",
    accent: true,
    body: "ways in proven across customer estates in a single weekend, 50× a specialist team",
  },
  {
    value: "94.1%",
    body: "of a public benchmark's known weaknesses caught in one pass",
  },
  {
    value: "Half",
    body: "of everything it proves is critical severity, not noise to triage",
  },
];

const DELIVERED = [
  {
    label: "One human pentester, one app",
    count: "~20",
    pill: "1× BASELINE",
    width: "2%",
    fill: "#4A5563",
  },
  {
    label: "Boutique team of three",
    count: "~60",
    pill: "3× FASTER",
    width: "6%",
    fill: "#6E7887",
  },
  {
    label: "Orwell, all subdomains",
    count: "1,000+",
    pill: "50× FASTER",
    width: "100%",
    fill: "#8C1027",
    hot: true,
  },
];

const WHERE: [string, string][] = [
  ["Your apps and APIs", "MOST OFTEN"],
  ["Cloud and infrastructure", "OFTEN"],
  ["Systems nobody owns any more", "ALWAYS"],
  ["Between two systems that trust each other", "THE WORST ONES"],
];

const EXAMPLES = [
  ["Logins that can be walked past", "Signing in as any account without ever knowing the password."],
  ["Databases open to the internet", "Live customer data sitting there for anyone who knows the address."],
  ["One customer reading another's data", "Change a number in a request and someone else's records come back."],
  ["Keys left where anyone can pick them up", "Working credentials retrievable with no access to start from."],
  ["Old software nobody updated", "A version with a published exploit, still facing the internet."],
  ["Small things that add up to a breach", "Three issues nobody would have escalated, chained into a full takeover."],
];

const COMPARE: [string, string, string, string][] = [
  ["Time to results", "Two to six weeks", "Hours, shallow", "Hours, in depth"],
  ["Cadence", "Once or twice a year", "Continuous", "Continuous"],
  ["Business logic flaws", "Yes, if scoped", "No", "Yes, by reasoning"],
  ["Knowledge retained", "Leaves with the team", "None", "Compounds per target"],
  ["Cost per assessment", "Tens of thousands", "Low, and low value", "A fraction, every week"],
];

export default function EvidencePage() {
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="sec sec--hair sec--paper sec--wash">
        <div className="washfill" />
        <div className="wrap">
          <div
            className="split split--center"
            style={{
              ["--a" as string]: "1.25fr",
              padding: "clamp(40px,4.6vw,64px) 0 clamp(32px,3.4vw,46px)",
            }}
          >
            <div>
              <Eyebrow>REPRODUCIBLE · PUBLIC BENCHMARK · LIVE ESTATES</Eyebrow>
              <h1
                className="h1 h1--page reveal"
                style={{ maxWidth: 660, margin: "30px 0 26px" }}
              >
                Every number here <span className="mark">came from a run</span>.
              </h1>
              <p className="lede" style={{ maxWidth: 560, marginBottom: 34 }}>
                Nothing below is a projection. Where a figure is approximate we say
                so, and where it comes from outside research we name who published
                it.
              </p>
              <div className="actions">
                <a href={APP_URL} className="btn">
                  RUN IT ON YOUR ESTATE
                </a>
                <Link href="/platform" className="link-u">
                  HOW IT WORKS
                </Link>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {HERO_STATS.map((st) => (
                <div
                  key={st.value}
                  className="tcard reveal lift"
                  style={{
                    ["--tc" as string]: st.accent ? "var(--crimson)" : "var(--ink)",
                    padding: "24px 26px",
                  }}
                >
                  <div
                    className={s.heroStat}
                    style={{ color: st.accent ? "var(--crimson)" : "var(--ink)" }}
                  >
                    {st.value}
                  </div>
                  <div className={s.heroStatBody}>{st.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- benchmark ---------- */}
      <section className="sec sec--hair sec--alt">
        <div className="wrap pad-sm">
          <Eyebrow num="01">BENCHMARK · OWASP JUICE SHOP</Eyebrow>
          <div className={s.bench} style={{ marginTop: 34 }}>
            <div className={s.benchLeft}>
              <div className="kicker" style={{ letterSpacing: "0.18em", marginBottom: 20 }}>
                GREYBOX · SINGLE RUN
              </div>
              <div className={s.benchBig}>94.1%</div>
              <p className="body" style={{ marginTop: 20, lineHeight: 1.6, color: "var(--ink-soft)" }}>
                of benchmark vulnerability classes surfaced in one autonomous pass,
                each finding reproduced and scored before it was reported.
              </p>
            </div>
            <div className={s.benchRight}>
              <div className="kicker" style={{ letterSpacing: "0.18em", marginBottom: 22 }}>
                BLACKBOX · COVERAGE BY ROUND
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <div className={s.barRow}>
                    <span style={{ color: "var(--slate)" }}>Three rounds</span>
                    <span className={s.barVal}>70.6%</span>
                  </div>
                  <div className="bar">
                    <div
                      className="bar__fill bar-anim"
                      style={{ width: "70.6%", background: "var(--line-3)" }}
                    />
                  </div>
                </div>
                <div>
                  <div className={s.barRow}>
                    <span style={{ fontWeight: 500 }}>Six rounds</span>
                    <span
                      className={s.barVal}
                      style={{ color: "var(--crimson)", fontWeight: 500 }}
                    >
                      82.4%
                    </span>
                  </div>
                  <div className="bar">
                    <div
                      className="bar__fill bar-anim"
                      style={{ width: "82.4%", background: "var(--crimson)" }}
                    />
                  </div>
                </div>
              </div>
              <p className="body" style={{ marginTop: 24, lineHeight: 1.6, color: "var(--ink-soft)" }}>
                Memory is why the second figure exists. The same target, tested
                again, yields more because everything prior is retained rather than
                rediscovered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- velocity ---------- */}
      <section className="sec sec--hair sec--ink" data-hero-dark>
        <div className="wrap pad-sm">
          <Eyebrow num="02" dark>
            VELOCITY · ONE 72 HOUR WINDOW
          </Eyebrow>

          <div
            className="split split--center"
            style={{
              ["--b" as string]: "1.2fr",
              ["--gap" as string]: "60px",
              marginTop: 34,
            }}
          >
            <div>
              <div className={s.velBig}>
                <b>1,000</b>
                <span>+</span>
              </div>
              <p className="lede--tight" style={{ color: "var(--mute-2)", marginTop: 22 }}>
                verified findings, across more than twenty subdomains tested in
                parallel, with no human operator in the loop.
              </p>
              <div className={s.velBadge}>
                <b>50×</b>
                <span>faster than one human pentester over the same window</span>
              </div>
              <div className={s.velStats}>
                <div>
                  <b>20+</b>
                  <span>subdomains, parallel</span>
                </div>
                <div>
                  <b>~14/hr</b>
                  <span>findings, continuous</span>
                </div>
                <div>
                  <b>72 hrs</b>
                  <span>start to finish</span>
                </div>
              </div>
            </div>

            <div>
              <div
                className="kicker"
                style={{ letterSpacing: "0.18em", marginBottom: 24 }}
              >
                SAME THREE DAYS · FINDINGS DELIVERED
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {DELIVERED.map((d) => (
                  <div key={d.label}>
                    <div className={s.barRow}>
                      <span
                        style={{
                          color: d.hot ? "var(--white)" : "var(--line-4)",
                          fontWeight: d.hot ? 500 : 400,
                        }}
                      >
                        {d.label}
                      </span>
                      <span style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                        <span
                          className={s.barVal}
                          style={{
                            fontSize: "clamp(0.95rem, 1vw, 0.9375rem)",
                            color: d.hot ? "var(--rose)" : "var(--mute)",
                            fontWeight: d.hot ? 500 : 400,
                          }}
                        >
                          {d.count}
                        </span>
                        <span
                          className={`${s.pill}${d.hot ? ` ${s["pill--hot"]}` : ""}`}
                          style={!d.hot ? { color: "var(--mute-2)" } : undefined}
                        >
                          {d.pill}
                        </span>
                      </span>
                    </div>
                    <div className="bar bar--dark">
                      <div
                        className="bar__fill bar-anim"
                        style={{ width: d.width, background: d.fill }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="body" style={{ marginTop: 24, lineHeight: 1.6, color: "var(--mute-2)" }}>
                Roughly fifty times the output of a full boutique team over the
                same three days. A year of conventional testing, delivered over a
                long weekend, then repeated the following week.
              </p>

              <div className={s.chart}>
                <div className="kicker" style={{ letterSpacing: "0.14em", marginBottom: 14 }}>
                  CUMULATIVE FINDINGS OVER THE WINDOW
                </div>
                <svg viewBox="0 0 520 120" aria-hidden>
                  <line x1="0" y1="112" x2="520" y2="112" stroke="#262D38" strokeWidth="1" />
                  <line x1="0" y1="60" x2="520" y2="60" stroke="#1C222B" strokeWidth="1" />
                  <line x1="0" y1="8" x2="520" y2="8" stroke="#1C222B" strokeWidth="1" />
                  <path
                    className={s.curveFill}
                    d="M0,112 L74,101 L148,84 L222,66 L296,49 L370,33 L444,19 L520,10 L520,112 Z"
                    fill="#8C1027"
                  />
                  <path
                    className={s.curve}
                    d="M0,112 L74,101 L148,84 L222,66 L296,49 L370,33 L444,19 L520,10"
                    fill="none"
                    stroke="#C4485F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle
                    className={s.curveDot}
                    cx="520"
                    cy="10"
                    r="5"
                    fill="#E14F6C"
                    style={{ transformOrigin: "520px 10px" }}
                  />
                </svg>
                <div className={s.chartAxis}>
                  <span>HOUR 0</span>
                  <span>HOUR 36</span>
                  <span style={{ color: "var(--rose)" }}>HOUR 72 · 1,000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what it finds ---------- */}
      <section className="sec sec--hair sec--paper">
        <div className="wrap pad-sm">
          <Eyebrow num="03">WHAT IT ACTUALLY FINDS</Eyebrow>
          <div
            className="split split--start"
            style={{
              ["--a" as string]: "0.72fr",
              ["--b" as string]: "1.28fr",
              marginTop: 34,
            }}
          >
            <div>
              <h2 className="h2 h2--xs reveal" style={{ marginBottom: 18 }}>
                The kinds of things it turns up.
              </h2>
              <p className="body" style={{ lineHeight: 1.62, color: "var(--ink-soft)", marginBottom: 24 }}>
                Not theory. These are the classes of problem Cipher proves again
                and again across the estates it runs on, and the ones most likely
                to end up in a breach report.
              </p>
              <div className="kicker" style={{ marginBottom: 10 }}>
                WHERE THEY TURN UP
              </div>
              <div className="rows rows--capped">
                {WHERE.map(([k, v]) => (
                  <div key={k}>
                    <span className="rows__k">{k}</span>
                    <span className="rows__v">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="kicker" style={{ letterSpacing: "0.18em", marginBottom: 20 }}>
                EXAMPLES IT HAS PROVEN
              </div>
              <div className={s.examples}>
                {EXAMPLES.map(([title, body]) => (
                  <div key={title}>
                    <b>{title}</b>
                    <p className="small" style={{ color: "var(--slate)" }}>
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- like for like ---------- */}
      <section className="sec sec--hair sec--alt">
        <div className="wrap pad-sm">
          <Eyebrow num="04">LIKE FOR LIKE</Eyebrow>
          <h2
            className="h2 h2--xs reveal"
            style={{ maxWidth: 640, margin: "30px 0 36px" }}
          >
            Faster than a consultancy. Deeper than a scanner.
          </h2>

          <div className={s.table}>
            <div className={`${s.trow} ${s["trow--head"]}`}>
              <div />
              <div>HUMAN PENTEST</div>
              <div>AUTOMATED SCANNER</div>
              <div>CIPHER</div>
            </div>
            {COMPARE.map(([label, human, scanner, cipher], i) => (
              <div
                key={label}
                className={`${s.trow}${
                  i === COMPARE.length - 1 ? ` ${s["trow--last"]}` : ""
                } reveal`}
              >
                <div>{label}</div>
                <div data-col="HUMAN PENTEST">{human}</div>
                <div data-col="SCANNER">{scanner}</div>
                <div data-col="CIPHER">{cipher}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section className="sec sec--ink" data-hero-dark>
        <div className="wrap pad-sm headrow" style={{ alignItems: "center" }}>
          <div>
            <h2
              className="h2 h2--xs reveal"
              style={{ color: "var(--white)", marginBottom: 12 }}
            >
              Run it against your own estate.
            </h2>
            <p className="body" style={{ color: "var(--mute-2)", maxWidth: 620 }}>
              One authorised target and a scope is enough to see this on your own
              estate.
            </p>
          </div>
          <a href={APP_URL} className="btn btn--sm btn--on-dark">
            GET ACCESS
          </a>
        </div>
      </section>

      <SiteFooter
        tagline="Cipher is the platform. Orwell is the analyst."
        links={["CONTACT", "OVERVIEW", "PLATFORM", "INTEGRATIONS", "TRUST"]}
      />
    </>
  );
}
