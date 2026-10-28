import Link from "next/link";
import Eyebrow from "@/components/site/Eyebrow";
import SiteFooter from "@/components/site/SiteFooter";
import OrwellConsole from "@/components/console/OrwellConsole";
import s from "./page.module.css";

const OLD_ROWS: [string, string][] = [
  ["Security tests booked in a year", "2"],
  ["Deploys shipped in the same year", "900+"],
  ["Days nobody looked at the new code", "363"],
];

const NEW_ROWS: [string, string][] = [
  ["Routes in found, all proven", "26"],
  ["Of them critical", "13"],
  ["Across one estate in a weekend", "1,000+"],
];

const CADENCE = [
  {
    label: "ON EVERY PUSH",
    title: "A merge starts a run",
    body: "Wire Cipher into the pipeline and every merged pull request gets tested the way an attacker would test it, before it reaches anyone.",
  },
  {
    label: "ON EVERY CHANGE",
    title: "New infrastructure tests itself",
    body: "A new subdomain, a new bucket, a role somebody widened on a Friday. Cipher notices it appear and goes after it without being asked.",
  },
  {
    label: "AND IN BETWEEN",
    title: "It keeps going on its own",
    body: "Between deploys it carries on probing what it already knows, so a route that opens up on a quiet Tuesday still gets caught that day.",
    accent: true,
  },
];

const QUOTES = [
  {
    accent: "#8C1027",
    text: "It found a hole in our payments flow that two manual reviews had signed off. We shipped the fix that afternoon.",
    role: "Head of Security Engineering",
    org: "FINTECH · 240 ENGINEERS",
    stat: "1 day",
    statNote: "from found to fixed",
  },
  {
    accent: "#0F7B8A",
    text: "We used to test once a year and hope. Now it runs every week, and it finds more each time because it remembers where to look.",
    role: "Director of Platform Engineering",
    org: "B2B SAAS · 90 ENGINEERS",
    stat: "12×",
    statNote: "more testing per year",
  },
  {
    accent: "#3D4E9E",
    text: "The record of what it did, and what it refused to do, is what got this through our risk review.",
    role: "Head of Risk and Compliance",
    org: "HEALTHCARE · REGULATED",
    stat: "2 weeks",
    statNote: "saved on review",
  },
];

const CTA_ROWS: [string, string][] = [
  ["One asset", "is all we need to begin"],
  ["Hours", "to the first proven finding"],
  ["Every week", "after that, not every year"],
];

export default function Home() {
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="sec sec--hair sec--paper">
        <div className="wrap">
          <div className={s.hero}>
            <Eyebrow>APPLICATION · CLOUD · NETWORK</Eyebrow>
            <h1 className={`h1 reveal ${s.heroTitle}`} style={{ marginTop: 36 }}>
              Find every bug and breach,{" "}
              <span className="mark">automatically and continuously</span>.
            </h1>
            <div className="split split--end" style={{ ["--a" as string]: "1.15fr" }}>
              <p className={`lede ${s.heroLede}`}>
                Cipher tests the way an attacker would, and it never stops. Every
                push, every deploy, every change to your cloud starts a new run,
                so what you shipped this morning is already tested.
              </p>
              <div className="actions" style={{ paddingBottom: 4 }}>
                <Link href="/contact" className="btn">
                  START WITH ONE ASSET
                </Link>
                <a href="#demo" className="link-u">
                  WATCH IT WORK
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* the old cadence vs cipher */}
        <div className={s.cadence}>
          <div className="wrap">
            <div className={s.cadenceGrid}>
              <div className={s.cadenceOld}>
                <div className={s.cadenceHead}>THE OLD CADENCE</div>
                <div className={s.bigNum}>
                  <b>21</b>
                  <span>days</span>
                </div>
                <p className={s.cadenceBody}>
                  between booking a test and hearing back on one asset. You will
                  have shipped it eleven more times before the report lands.
                </p>
                <div className="rows">
                  {OLD_ROWS.map(([k, v]) => (
                    <div key={k}>
                      <span className="rows__k">{k}</span>
                      <span className="rows__v">{v}</span>
                    </div>
                  ))}
                </div>
                <div className={s.cadenceFoot}>
                  A TYPICAL MID SIZED ENGINEERING TEAM
                </div>
              </div>

              <div className={s.cadenceNew}>
                <div className={s.cadenceHead}>WITH CIPHER, ON EVERY PUSH</div>
                <div className={s.bigNum}>
                  <b>34</b>
                  <span>minutes</span>
                </div>
                <p className={s.cadenceBody}>
                  from a merged pull request to every route in, proven on your own
                  system. Then again on the next push, and the one after that.
                </p>
                <div className="rows rows--dark">
                  {NEW_ROWS.map(([k, v]) => (
                    <div key={k}>
                      <span className="rows__k">{k}</span>
                      <span className="rows__v">{v}</span>
                    </div>
                  ))}
                </div>
                <div className={s.cadenceFoot}>
                  ONE LIVE ASSET · 50× A SPECIALIST TEAM
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={s.strip}>
          <div className={s.stripInner}>
            <p className={s.stripText}>
              The worst one it found took four steps: a staging login left on, a
              read only support account, a file it could rename, and then every
              customer balance.{" "}
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                Not one of those steps would have failed an audit
              </span>
              , and the third one shipped the week after the last pentest passed.
            </p>
            <Link href="/evidence" className="link-u link-u--soft">
              SEE THE ROUTE
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- cadence ---------- */}
      <section className="sec sec--hair sec--paper">
        <div className="wrap pad">
          <div className="headrow" style={{ marginBottom: 44 }}>
            <div>
              <Eyebrow>CADENCE</Eyebrow>
              <h2 className="h2 reveal" style={{ maxWidth: 720, marginTop: 26 }}>
                Security testing should run like your test suite.
              </h2>
            </div>
            <p className="body" style={{ maxWidth: 320 }}>
              Nobody ships code once a quarter. Nobody should test for attackers
              once a quarter either.
            </p>
          </div>

          <div className="cols" style={{ ["--n" as string]: 3 }}>
            {CADENCE.map((c) => (
              <div key={c.title} className="reveal lift">
                <div
                  className="kicker"
                  style={{
                    marginBottom: 16,
                    color: c.accent ? "var(--crimson)" : undefined,
                  }}
                >
                  {c.label}
                </div>
                <div className="h3" style={{ marginBottom: 10 }}>
                  {c.title}
                </div>
                <p className="body">{c.body}</p>
              </div>
            ))}
          </div>

          <div
            className="headrow"
            style={{
              marginTop: 30,
              borderTop: "1px solid var(--ink)",
              paddingTop: 26,
              alignItems: "center",
            }}
          >
            <p className="lede--tight" style={{ maxWidth: 820, color: "var(--ink-soft)" }}>
              This is the difference between a report and a signal.{" "}
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                You stop finding out at audit time and start finding out at deploy
                time.
              </span>
            </p>
            <Link href="/platform" className="link-u link-u--soft">
              HOW IT RUNS
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- why it matters now ---------- */}
      <section className="sec sec--hair sec--ink" data-hero-dark>
        <div className="wrap pad">
          <div
            className="split split--center"
            style={{ ["--a" as string]: "0.95fr", ["--b" as string]: "1.35fr", ["--gap" as string]: "64px" }}
          >
            <div>
              <Eyebrow num="II." dark>
                WHY IT MATTERS NOW
              </Eyebrow>
              <h2
                className="h2 reveal"
                style={{ color: "var(--white)", margin: "26px 0 22px" }}
              >
                Attackers stopped waiting.
              </h2>
              <p className="lede--tight" style={{ color: "var(--mute-2)" }}>
                They automated the work of getting in. A once a year test and a
                scanner that only recognises what it has seen before is no longer
                a defence, it is a schedule.
              </p>
            </div>

            <div className={s.whyGrid}>
              <div className={`${s.whyCell} reveal dark-lift`}>
                <div className={s.whyNum}>29 min</div>
                <div className={s.whyText}>
                  is all it takes to go from a foothold to moving through your
                  network. The record is 27 seconds.
                </div>
              </div>
              <div className={`${s.whyCell} reveal dark-lift`}>
                <div className={s.whyNum}>74 days</div>
                <div className={s.whyText}>
                  is how long the average serious flaw stays open. Nearly half are
                  never fixed at all.
                </div>
              </div>
              <div className={`${s.whyCell} reveal dark-lift`}>
                <div className={s.whyNum}>16B</div>
                <div className={s.whyText}>
                  credentials leaked worldwide, the largest exposure ever recorded,
                  and the credibility damage outlasts the cleanup.
                </div>
              </div>
              <div className={`${s.whyCell} reveal dark-lift`}>
                <div className={s.whyNumBig}>$10.5T</div>
                <div className={s.whyText}>
                  the cost of cybercrime worldwide this year. As an economy it
                  would rank third, behind only the US and China.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- live demo ---------- */}
      <section id="demo" className="sec sec--hair sec--alt">
        <div className="wrap pad">
          <div className="headrow" style={{ marginBottom: 34 }}>
            <div>
              <Eyebrow num="III.">SEE IT FOR YOURSELF</Eyebrow>
              <h2
                className="h2 reveal"
                style={{ maxWidth: 640, margin: "26px 0 16px" }}
              >
                A real run, replaying at speed.
              </h2>
              <p className="lede--tight" style={{ maxWidth: 620, color: "var(--ink-soft)" }}>
                Open any finding to see what it means and how to fix it. Pause it,
                filter it, or type an instruction and watch it change course.
              </p>
            </div>
            <div className="bullets">
              {[
                "Click a finding to open it",
                "Pause or replay the run",
                "Send it somewhere new",
              ].map((b) => (
                <div className="bullet" key={b}>
                  <span className="diamond" />
                  <span className="bullet__text">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <OrwellConsole />

          <div className={s.demoFoot}>
            <p className="body" style={{ maxWidth: 720, lineHeight: 1.6 }}>
              Two of the actions in this run were refused, because they would have
              damaged data. Those refusals are in the record too.
            </p>
            <Link href="/platform" className="link-u">
              HOW IT WORKS
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- field reports ---------- */}
      <section className="sec sec--hair sec--paper">
        <div className="wrap pad">
          <div className="headrow" style={{ marginBottom: 40 }}>
            <div>
              <Eyebrow num="IV.">FIELD REPORTS</Eyebrow>
              <h2 className="h2 reveal" style={{ maxWidth: 660, marginTop: 26 }}>
                What leaders are saying.
              </h2>
            </div>
            <p className="body" style={{ maxWidth: 320, color: "var(--slate-2)" }}>
              Attributed by role and sector. Named references available on request.
            </p>
          </div>

          <div className={s.quotes}>
            {QUOTES.map((q) => (
              <div
                key={q.role}
                className={`${s.quoteCard} reveal lift`}
                style={{ ["--accent" as string]: q.accent }}
              >
                <p className={s.quoteText}>{q.text}</p>
                <div className={s.quoteMeta}>
                  <div className={s.quoteRole}>{q.role}</div>
                  <div className={s.quoteOrg}>{q.org}</div>
                  <div className={s.quoteStat}>
                    <b>{q.stat}</b>
                    <span>{q.statNote}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section className="sec sec--ink" data-hero-dark>
        <div
          className="wrap pad split split--center"
          style={{ ["--a" as string]: "1.25fr", ["--b" as string]: "0.75fr", ["--gap" as string]: "64px" }}
        >
          <div>
            <h2
              className="h2 h2--lg reveal"
              style={{ color: "var(--white)", marginBottom: 22 }}
            >
              Pick one asset. See what we find.
            </h2>
            <p
              className="lede--tight"
              style={{ color: "var(--mute-2)", maxWidth: 580, marginBottom: 34 }}
            >
              Choose an app, a cloud account, or a host you own. You will have
              proven findings before your next standup, and a full record of
              everything we looked at.
            </p>
            <div className="actions">
              <Link href="/contact" className="btn btn--sm btn--on-dark">
                START WITH ONE ASSET
              </Link>
              <Link href="/evidence" className="link-u link-u--on-dark">
                SEE THE PROOF
              </Link>
            </div>
          </div>
          <div className={s.ctaList}>
            {CTA_ROWS.map(([k, v]) => (
              <div key={k}>
                <b>{k}</b>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter links={["PLATFORM", "EVIDENCE", "TRUST", "CONTACT"]} />
    </>
  );
}
