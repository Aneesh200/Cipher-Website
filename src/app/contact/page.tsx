import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/site/Eyebrow";
import SiteFooter from "@/components/site/SiteFooter";
import EnquiryForm from "@/components/contact/EnquiryForm";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Name an asset you own and the person who authorises testing on it. We return a scope document and the safety constraints in writing.",
};

const STEPS = [
  {
    n: "01",
    title: "Scope document",
    body: "Returned within two business days, naming exactly what is in and out of bounds.",
  },
  {
    n: "02",
    title: "Authorisation confirmed",
    body: "Signed by your named authoriser. Nothing is provisioned before that signature exists.",
  },
  {
    n: "03",
    title: "First findings",
    body: "Verified, with reproduction steps and a full audit log, within hours of the run starting.",
    accent: true,
  },
];

const CONTACT_EMAIL = "contact@authify.tech";

const CTA_ROWS: [string, string][] = [
  ["One asset", "is all we need to begin"],
  ["Hours", "to first verified findings"],
  ["Full audit log", "of every action taken"],
];

export default function ContactPage() {
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="sec sec--hair sec--paper">
        <div className="wrap">
          <div className={s.heroGrid}>
            <div className={s.heroLeft}>
              <Eyebrow num="CONTACT">WE REPLY IN TWO BUSINESS DAYS</Eyebrow>
              <h1
                className="h1 h1--contact reveal"
                style={{ maxWidth: 660, margin: "30px 0 26px" }}
              >
                Tell us which asset you want assessed.
              </h1>
              <p className="lede--tight" style={{ maxWidth: 600, color: "var(--ink-soft)" }}>
                Every engagement begins the same way: you name an asset you own,
                and the person who authorises testing on it. We return a scope
                document and the safety constraints in writing before anything
                runs.
              </p>
              <p
                className="lede--tight"
                style={{ maxWidth: 600, color: "var(--ink-soft)", marginTop: 20 }}
              >
                No procurement cycle is required to see the platform work on
                something real.
              </p>
            </div>

            <div className={s.heroRight}>
              <div
                className="kicker"
                style={{ fontSize: 11, letterSpacing: "0.18em", marginBottom: 22 }}
              >
                WHAT HAPPENS NEXT
              </div>
              <div className={s.steps}>
                {STEPS.map((st) => (
                  <div key={st.n} className="reveal">
                    <div className={s.stepHead}>
                      <b
                        className="mono"
                        style={{ color: st.accent ? "var(--crimson)" : "var(--ink)" }}
                      >
                        {st.n}
                      </b>
                      <span>{st.title}</span>
                    </div>
                    <p>{st.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- enquiry ---------- */}
      <section id="enquiry" className="sec sec--hair sec--alt">
        <div
          className="wrap pad-sm split split--start"
          style={{ ["--a" as string]: "1.05fr", ["--gap" as string]: "64px" }}
        >
          <EnquiryForm />

          <div>
            <div
              className="kicker"
              style={{ fontSize: 11, letterSpacing: "0.18em", marginBottom: 20 }}
            >
              OR EMAIL US DIRECTLY
            </div>
            <div className={s.direct}>
              <a href={`mailto:${CONTACT_EMAIL}`} className={s.directLink}>
                {CONTACT_EMAIL}
              </a>
              <p>
                Scoping, pricing, security disclosures, and anything about
                running Cipher on your own estate. We reply within two business
                days.
              </p>
            </div>

            <div className={s.beforeBox}>
              <div>BEFORE YOU WRITE TO US</div>
              <p>
                We only assess assets you can authorise. If the asset belongs to a
                customer or a vendor, we will need their written authorisation too,
                not yours.
              </p>
              <p>
                Nothing you send here is shared outside Cipher, and enquiry details
                are never used to train a model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section className="sec sec--ink" data-hero-dark>
        <div
          className="wrap pad-sm split split--center"
          style={{ ["--a" as string]: "1.2fr", ["--b" as string]: "0.8fr", ["--gap" as string]: "60px" }}
        >
          <div>
            <h2
              className="h2 h2--xs reveal"
              style={{ color: "var(--white)", marginBottom: 18 }}
            >
              Would you rather see it first?
            </h2>
            <p
              className="lede--tight"
              style={{ color: "var(--mute-2)", maxWidth: 560, marginBottom: 30 }}
            >
              The overview page has a live engagement you can pause, filter, and
              steer, and the evidence page has the benchmark numbers with their
              sources.
            </p>
            <div className="actions">
              <Link href="/" className="btn btn--sm btn--on-dark">
                SEE ORWELL RUN
              </Link>
              <Link href="/evidence" className="link-u link-u--on-dark">
                READ THE EVIDENCE
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

      <SiteFooter
        tagline="Cipher is the platform. Orwell is the analyst."
        links={["OVERVIEW", "PLATFORM", "INTEGRATIONS", "EVIDENCE", "TRUST"]}
      />
    </>
  );
}
