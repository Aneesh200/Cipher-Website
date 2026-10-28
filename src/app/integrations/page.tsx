import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/site/Eyebrow";
import SiteFooter from "@/components/site/SiteFooter";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Every merge triggers a run. Findings land as tickets in the board you already use, in the channel your team already reads.",
};

/** Brand mark on a white tile, or a monospace stand-in when there is no logo. */
function Logo({
  src,
  glyph,
  name,
  size = 26,
  pad = 5,
  radius = 5,
  glyphSize = 11,
}: {
  src?: string | null;
  glyph?: string;
  name: string;
  size?: number;
  pad?: number;
  radius?: number;
  glyphSize?: number;
}) {
  const vars = {
    ["--size" as string]: `${size}px`,
    ["--pad" as string]: `${pad}px`,
    ["--radius" as string]: `${radius}px`,
    ["--glyph" as string]: `${glyphSize}px`,
  };

  if (!src) {
    return (
      <span className={`${s.logo} ${s.logoGlyph}`} style={vars} aria-hidden>
        {glyph}
      </span>
    );
  }

  return (
    <span className={s.logo} style={vars}>
      {/* Vendored brand marks — fixed size, served as-is. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${name} logo`} width={size} height={size} />
    </span>
  );
}

const HERO_STATS = [
  ["On merge", "a run starts, no schedule required"],
  ["4 min", "median time to a ticket in your board"],
  ["Zero", "dashboards anyone has to remember to check"],
  ["One API", "if the thing you use is not on this page"],
];

const WORKS_WITH = [
  ["GitHub", "/logos/github.svg"],
  ["GitLab", "/logos/gitlab.svg"],
  ["Bitbucket", "/logos/bitbucket.svg"],
  ["Jenkins", "/logos/jenkins.svg"],
  ["Jira", "/logos/jira.svg"],
  ["Linear", "/logos/linear.svg"],
  ["Slack", "/logos/slack.svg"],
  ["Teams", "/logos/teams.svg"],
  ["Okta", "/logos/okta.svg"],
];

const PIPELINE = [
  {
    tint: "#0F7B8A",
    time: "00:00",
    title: "Someone merges",
    body: "A webhook from GitHub, GitLab, or Bitbucket tells Cipher what changed and where it deployed.",
  },
  {
    tint: "#3D4E9E",
    time: "00:12",
    title: "A run starts",
    body: "Scoped to what moved. New and changed endpoints get the deep pass, the rest gets a regression check.",
  },
  {
    tint: "#B5741A",
    time: "00:34",
    title: "It proves what it finds",
    body: "Nothing is reported until it has been reproduced, so no one spends a morning on a false positive.",
  },
  {
    tint: "#8C1027",
    time: "00:38",
    title: "A ticket appears",
    body: "In Jira or Linear, on the right team, with the reproduction steps and the commit that introduced it.",
  },
  {
    tint: "#0F7B8A",
    time: "ONGOING",
    title: "It closes itself",
    body: "The next run retests the fix. If it holds, the ticket closes on its own. If it does not, it reopens.",
  },
];

const CI_CARDS = [
  {
    name: "GitHub Actions",
    logo: "/logos/github.svg",
    body: "Install the app, pick your repos. Runs fire on merge to any branch you nominate, and results post back as a check plus an annotated PR comment.",
    code: "- uses: cipher/scan@v1\n  with:\n    fail-on: critical",
  },
  {
    name: "GitLab CI",
    logo: "/logos/gitlab.svg",
    body: "Self managed or SaaS. Findings arrive in the merge request widget alongside your own security reports, in the format GitLab already renders.",
    code: "cipher:\n  stage: test\n  image: cipher/cli",
  },
  {
    name: "Bitbucket",
    logo: "/logos/bitbucket.svg",
    body: "Pipelines integration with the same gating options, and Jira linking that works out of the box because both live in your Atlassian tenant.",
    code: "- pipe: cipher/scan:1\n  variables:\n    FAIL_ON: critical",
  },
];

const CI_MINI = [
  {
    name: "Jenkins",
    logo: "/logos/jenkins.svg",
    body: "Plugin, or the CLI in any freestyle or declarative stage.",
  },
  {
    name: "CircleCI",
    logo: "/logos/circleci.svg",
    body: "Published orb, one line in your workflow config.",
  },
  {
    name: "Azure DevOps",
    logo: "/logos/azure.svg",
    body: "Marketplace task, with Boards ticketing wired in.",
  },
  {
    name: "Anything else",
    logo: null,
    glyph: "{ }",
    body: "A container and a token. If it can run Docker, it can run Cipher.",
  },
];

const CATALOGUE = [
  {
    tint: "#8697E8",
    label: "ISSUE TRACKING",
    items: [
      {
        name: "Jira",
        logo: "/logos/jira.svg",
        mode: "TWO WAY",
        body: "Tickets on the right project and epic. Close it in Jira and Cipher retests before agreeing.",
      },
      {
        name: "Linear",
        logo: "/logos/linear.svg",
        mode: "TWO WAY",
        body: "Severity mapped to your priority scale, routed to the team that owns the service.",
      },
      {
        name: "GitHub Issues",
        logo: "/logos/github.svg",
        mode: "TWO WAY",
        body: "Labelled, assigned, and linked to the commit that introduced the problem.",
      },
      {
        name: "Asana",
        logo: "/logos/asana.svg",
        mode: "PUSH",
        body: "Findings created as tasks, with status pushed on every retest.",
      },
      {
        name: "Azure Boards",
        logo: "/logos/azure.svg",
        mode: "PUSH",
        body: "Work items raised in the right area path, closed when the fix holds.",
      },
    ],
  },
  {
    tint: "#5BC8DC",
    label: "ALERTING AND CHAT",
    items: [
      {
        name: "Slack",
        logo: "/logos/slack.svg",
        mode: "TWO WAY",
        body: "Criticals to the channel you choose. Triage, snooze, or file a ticket in the thread.",
      },
      {
        name: "Microsoft Teams",
        logo: "/logos/teams.svg",
        mode: "TWO WAY",
        body: "The same cards and the same actions, for teams that live in Teams.",
      },
      {
        name: "PagerDuty",
        logo: "/logos/pagerduty.svg",
        mode: "PUSH",
        body: "Page the on call rota when something critical appears on production.",
      },
      {
        name: "Opsgenie",
        logo: "/logos/opsgenie.svg",
        mode: "PUSH",
        body: "Alert routing and escalation policies you have already tuned.",
      },
      {
        name: "Email & webhooks",
        logo: null,
        glyph: "WH",
        mode: "PUSH",
        body: "Digests for the people who want a weekly summary and nothing else.",
      },
    ],
  },
  {
    tint: "#E0A040",
    label: "IDENTITY AND REPORTING",
    items: [
      {
        name: "Okta, Entra, Google",
        logo: "/logos/okta.svg",
        mode: "SSO & SCIM",
        body: "SAML sign in and directory sync, so access follows joiners and leavers.",
      },
      {
        name: "Vanta & Drata",
        logo: "/logos/vanta.png",
        mode: "PUSH",
        body: "Continuous testing evidence pushed straight at your SOC 2 controls.",
      },
      {
        name: "Splunk, Datadog, SIEM",
        logo: "/logos/splunk.svg",
        mode: "PUSH",
        body: "Findings and the full audit log streamed to your security telemetry.",
      },
    ],
  },
];

const NEVER: [string, string, boolean?][] = [
  ["Your source code", "NEVER LEAVES"],
  ["Access we ask for", "READ ONLY"],
  ["Findings used for training", "NEVER", true],
  ["Every action taken", "IN THE AUDIT LOG"],
];

export default function IntegrationsPage() {
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className={`sec ${s.hero}`} data-hero-dark>
        <div className="wrap">
          <div className={s.heroInner}>
            <Eyebrow dark>INTEGRATIONS</Eyebrow>
            <h1 className={`h1 h1--wide reveal ${s.heroTitle}`} style={{ marginTop: 34 }}>
              It runs where your code already goes.
            </h1>
            <div className="split split--end" style={{ ["--a" as string]: "1.15fr" }}>
              <p className="lede" style={{ maxWidth: 620, color: "var(--mute-2)" }}>
                Every merge triggers a run. Findings land as tickets in the board
                you already use, in the channel your team already reads. Nobody
                has to open Cipher for Cipher to work.
              </p>
              <div className="actions" style={{ paddingBottom: 4 }}>
                <Link href="/contact" className="btn btn--on-dark">
                  CONNECT YOUR STACK
                </Link>
                <a href="#catalogue" className="link-u link-u--on-dark">
                  SEE EVERYTHING
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={s.heroStats}>
          <div className="wrap">
            <div
              className="cols cols--wide cols--dark cols--nolid"
              style={{ ["--n" as string]: 4 }}
            >
              {HERO_STATS.map(([k, v]) => (
                <div key={k} className={s.heroStat}>
                  <b>{k}</b>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- works with ---------- */}
      <section className="sec sec--hair sec--alt">
        <div className="wrap" style={{ paddingBlock: 30 }}>
          <div className={s.worksWith}>
            <span className="kicker" style={{ whiteSpace: "nowrap" }}>
              WORKS WITH
            </span>
            <div className={s.chips}>
              {WORKS_WITH.map(([name, logo]) => (
                <div key={name} className={s.chip}>
                  <Logo src={logo} name={name} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the pipeline ---------- */}
      <section className="sec sec--hair sec--paper">
        <div className="wrap pad">
          <Eyebrow>THE PIPELINE</Eyebrow>
          <h2
            className="h2 h2--sm h2--bold reveal"
            style={{ maxWidth: 760, margin: "30px 0 16px" }}
          >
            A pull request opens. Nobody does anything.
          </h2>
          <p className="lede" style={{ maxWidth: 700, marginBottom: 44 }}>
            This is the whole workflow. It happens on every change, whether or not
            anyone is watching.
          </p>

          <div
            className={`cols cols--wide ${s.pipeline}`}
            style={{ ["--n" as string]: 5 }}
          >
            {PIPELINE.map((p) => (
              <div key={p.title} className="reveal">
                <div className={s.stage}>
                  <i style={{ background: p.tint }} />
                  <span>{p.time}</span>
                </div>
                <div className={s.stageTitle}>{p.title}</div>
                <p className="small">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="note" style={{ marginTop: 26 }}>
            <span className="diamond" />
            <p>
              Optionally it blocks the merge. Most teams start with warnings only,
              then turn on the gate for criticals once they trust the signal.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- ci and cd ---------- */}
      <section className="sec sec--hair sec--alt">
        <div className="wrap pad">
          <Eyebrow tint="#0F7B8A">CI AND CD</Eyebrow>
          <h2
            className="h2 h2--sm h2--bold reveal"
            style={{ maxWidth: 720, margin: "30px 0 16px" }}
          >
            Wherever your pipeline runs, Cipher runs with it.
          </h2>
          <p className="lede" style={{ maxWidth: 680, marginBottom: 42 }}>
            Native app, or a single job step. Both take about ten minutes to set
            up, and neither needs your source code to leave your systems.
          </p>

          <div className="grid3" style={{ marginBottom: 20 }}>
            {CI_CARDS.map((c) => (
              <div key={c.name} className={`${s.ciCard} lift`}>
                <div className={s.ciHead}>
                  <span className={s.ciName}>
                    <Logo src={c.logo} name={c.name} size={34} pad={7} radius={7} />
                    {c.name}
                  </span>
                  <span className={s.badge}>NATIVE APP</span>
                </div>
                <p className="small" style={{ marginBottom: 18 }}>
                  {c.body}
                </p>
                <pre className={s.code}>{c.code}</pre>
              </div>
            ))}
          </div>

          <div className="cols cols--wide" style={{ ["--n" as string]: 4 }}>
            {CI_MINI.map((m) => (
              <div key={m.name}>
                <div className={s.ciMini}>
                  <Logo
                    src={m.logo}
                    glyph={m.glyph}
                    name={m.name}
                    size={28}
                    pad={6}
                    radius={7}
                  />
                  <b>{m.name}</b>
                </div>
                <div className="small">{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- catalogue ---------- */}
      <section id="catalogue" className="sec sec--hair sec--deep" data-hero-dark>
        <div className="wrap pad">
          <Eyebrow dark>EVERYTHING ELSE</Eyebrow>
          <h2
            className="h2 h2--sm h2--bold reveal"
            style={{ maxWidth: 760, margin: "30px 0 16px", color: "var(--white)" }}
          >
            Findings go where your team already is.
          </h2>
          <p
            className="lede"
            style={{ maxWidth: 680, marginBottom: 44, color: "var(--mute-2)" }}
          >
            Nobody adopts another dashboard. So Cipher pushes into the tools you
            have, with two way sync wherever the tool supports it.
          </p>

          <div className="grid3" style={{ ["--g" as string]: "22px", alignItems: "start" }}>
            {CATALOGUE.map((group) => (
              <div key={group.label}>
                <div className={s.catHead}>
                  <i style={{ background: group.tint }} />
                  <span>{group.label}</span>
                </div>
                <div className={s.catList}>
                  {group.items.map((it) => (
                    <div key={it.name} className={`${s.catItem} dark-lift`}>
                      <Logo
                        src={it.logo}
                        glyph={it.glyph}
                        name={it.name}
                        size={38}
                        pad={8}
                        radius={6}
                        glyphSize={14}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div className={s.catItemHead}>
                          <b>{it.name}</b>
                          <span
                            className={s.catMode}
                            style={{
                              color:
                                it.mode === "PUSH"
                                  ? "var(--slate)"
                                  : "var(--white)",
                            }}
                          >
                            {it.mode}
                          </span>
                        </div>
                        <div className={s.catItemBody}>{it.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={s.catFoot}>
            <p className="lede--tight" style={{ maxWidth: 820, color: "var(--mute-2)" }}>
              Not on the list? Everything above is built on the same public API and
              webhook system you get, so anything with an endpoint can be wired up
              in an afternoon.
            </p>
            <Link href="/contact" className="link-u link-u--on-dark">
              ASK ABOUT YOURS
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- what we never touch ---------- */}
      <section className="sec sec--hair sec--paper">
        <div
          className="wrap pad-sm split split--center"
          style={{ ["--a" as string]: "1.1fr", ["--gap" as string]: "60px" }}
        >
          <div>
            <Eyebrow>WHAT WE NEVER TOUCH</Eyebrow>
            <h2
              className="h2 h2--sm h2--bold reveal"
              style={{ margin: "26px 0 18px" }}
            >
              Connecting Cipher does not hand us your code.
            </h2>
            <p className="lede--tight" style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
              The pipeline integration tells Cipher that something changed and
              where it now runs. It tests the deployed system from the outside, the
              way an attacker reaches it.
            </p>
            <Link href="/trust" className="link-u">
              READ THE TRUST MODEL
            </Link>
          </div>
          <div className="rows rows--capped">
            {NEVER.map(([k, v, alert]) => (
              <div key={k}>
                <span className="rows__k" style={{ color: "var(--ink-soft)" }}>
                  {k}
                </span>
                <span
                  className="rows__v"
                  style={{ color: alert ? "var(--crimson)" : "var(--slate)" }}
                >
                  {v}
                </span>
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
              className="h2 h2--sm h2--bold reveal"
              style={{ color: "var(--white)", marginBottom: 12 }}
            >
              Wire it into one repo this week.
            </h2>
            <p className="lede--tight" style={{ color: "var(--mute-2)", maxWidth: 620 }}>
              Pick a service, connect the pipeline, and watch the first run go on
              your next merge. No procurement cycle needed to see it work.
            </p>
          </div>
          <Link href="/contact" className="btn btn--on-dark">
            CONNECT YOUR STACK
          </Link>
        </div>
      </section>

      <SiteFooter
        links={["OVERVIEW", "PLATFORM", "EVIDENCE", "TRUST", "CONTACT"]}
      />
    </>
  );
}
