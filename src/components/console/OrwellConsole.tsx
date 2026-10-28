"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FINDINGS,
  KINDS,
  SEV,
  TRACE,
  type TraceKind,
  type TraceRow,
} from "@/data/console";

const KIND_KEYS = Object.keys(KINDS) as TraceKind[];
const TICK_MS = 1400;

export default function OrwellConsole() {
  const [step, setStep] = useState(4);
  const [playing, setPlaying] = useState(true);
  const [tab, setTab] = useState<"mind" | "finding">("mind");
  const [selected, setSelected] = useState("f1");
  const [off, setOff] = useState<Partial<Record<TraceKind, boolean>>>({});
  const [nudge, setNudge] = useState("");
  const [extra, setExtra] = useState<TraceRow[]>([]);

  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setStep((s) => (s >= TRACE.length ? TRACE.length : s + 1)),
      TICK_MS
    );
    return () => clearInterval(id);
  }, [playing]);

  const done = step >= TRACE.length;
  const seen = useMemo(() => TRACE.slice(0, step), [step]);
  const countKind = (k: TraceKind) => seen.filter((r) => r.k === k).length;

  const findings = countKind("FINDING");
  const guards = countKind("GUARD");
  const tools = countKind("TOOL");
  const shown = Math.min(FINDINGS.length, 1 + findings * 3);
  const coverage = Math.min(99, 22 + step * 4.4);

  const rows = useMemo(
    () => [...seen, ...extra].filter((r) => !off[r.k]),
    [seen, extra, off]
  );

  // Follow the stream, but only while the reader is already at the end of it.
  useEffect(() => {
    const el = streamRef.current;
    if (!el) return;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < el.clientHeight * 0.5;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [rows.length]);

  const sel = FINDINGS.find((f) => f.id === selected) ?? FINDINGS[0];
  const selSev = SEV[sel.sev];

  const sendNudge = () => {
    const v = nudge.trim();
    if (!v) return;
    setNudge("");
    setExtra((prev) => [
      ...prev,
      {
        k: "REASONING",
        t: "now",
        x: `Operator directive received: "${v}". Folding it into the current phase and re-planning the next requests around it.`,
      },
      {
        k: "TOOL",
        t: "now",
        x: "http GET https://target/  ·  following operator directive",
        badge: "ALLOW",
        meta: "HTTP · QUEUED",
      },
    ]);
  };

  const engineLabel = done ? "complete" : playing ? "running" : "paused";
  const engineColor = done ? "#4BA36B" : playing ? "#E14F6C" : "#C08040";
  const elapsed = done
    ? "00:34"
    : `00:${String(Math.min(34, 6 + step)).padStart(2, "0")}`;

  const phases = [
    { name: "orwell", tag: "P0", dot: "#4BA36B" },
    { name: "/recon", tag: "P1", dot: step > 6 ? "#4BA36B" : "#C08040" },
    {
      name: "/web-apptest",
      tag: "P2",
      dot: done ? "#4BA36B" : step > 9 ? "#C08040" : "#C9CFD6",
    },
  ];

  const runInfo: [string, string][] = [
    ["mode", "blackbox"],
    ["status", done ? "completed" : "running"],
    ["rate cap", "10 rps"],
    ["exploitation", "safe_validation"],
    ["auth method", "dns_txt_token"],
    ["verified", "yes"],
  ];

  return (
    <div className="orw">
      <div className="orw__bar">
        <div className="orw__brand">
          <i />
          <b>CIPHER</b>
          <em>// CONSOLE</em>
        </div>
        <div className="orw__tools">
          <div className="orw__engine">
            <span
              className="orw__dot"
              style={{ background: engineColor }}
              aria-hidden
            />
            <span>ENGINE · {engineLabel}</span>
          </div>
          <button
            type="button"
            className="orw__btn"
            onClick={() => setPlaying((v) => !v)}
          >
            {playing ? "PAUSE" : "RESUME"}
          </button>
          <button
            type="button"
            className="orw__btn orw__btn--primary"
            onClick={() => {
              setStep(1);
              setPlaying(true);
              setExtra([]);
              setTab("mind");
            }}
          >
            REPLAY
          </button>
        </div>
      </div>

      <div className="orw__body">
        {/* ---- findings rail ---- */}
        <div className="orw__rail orw__rail--left">
          <div className="orw__label">ENGAGEMENT</div>
          <div className="orw__engagement">Authify Tech</div>
          <div className="orw__engagement-sub">blackbox · external · web</div>

          <div className="orw__label">PHASES</div>
          <div className="orw__phases">
            {phases.map((p) => (
              <div key={p.name} className="orw__phase">
                <span className="orw__phase-name">
                  <span
                    className="orw__phase-dot"
                    style={{ background: p.dot }}
                  />
                  {p.name}
                </span>
                <span className="orw__phase-tag">{p.tag}</span>
              </div>
            ))}
          </div>

          <div className="orw__label">FINDINGS · {shown}</div>
          <div className="orw__hint">CLICK ONE TO INSPECT IT</div>
          <div className="orw__findings">
            {FINDINGS.slice(0, shown).map((f) => {
              const c = SEV[f.sev];
              const active = f.id === selected;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`orw__finding${active ? " is-active" : ""}`}
                  style={{ borderLeftColor: active ? c.edge : "transparent" }}
                  onClick={() => {
                    setSelected(f.id);
                    setTab("finding");
                  }}
                >
                  <span
                    className="orw__chip"
                    style={{ background: c.chipBg, color: c.chipText }}
                  >
                    {f.sev}
                  </span>
                  <span className="orw__finding-title">{f.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- stream / detail ---- */}
        <div className="orw__main">
          <div className="orw__tabs">
            <button
              type="button"
              className={`orw__tab${tab === "mind" ? " is-active" : ""}`}
              onClick={() => setTab("mind")}
            >
              AGENT MIND
            </button>
            <button
              type="button"
              className={`orw__tab${tab === "finding" ? " is-active" : ""}`}
              onClick={() => setTab("finding")}
            >
              FINDING DETAIL
            </button>
            <div className="orw__elapsed">ELAPSED {elapsed}</div>
          </div>

          {tab === "mind" ? (
            <div className="orw__pane">
              <div className="orw__filters">
                <span className="orw__label">FILTER</span>
                {KIND_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`orw__chipbtn${off[k] ? " is-off" : ""}`}
                    aria-pressed={!off[k]}
                    onClick={() =>
                      setOff((prev) => ({ ...prev, [k]: !prev[k] }))
                    }
                  >
                    <i style={{ background: KINDS[k].dot }} />
                    {KINDS[k].label}
                  </button>
                ))}
              </div>

              <div className="orw__stream" ref={streamRef}>
                {rows.map((r, i) => {
                  const kd = KINDS[r.k];
                  const thinking = r.k === "THINKING";
                  const tool = r.k === "TOOL";
                  return (
                    <div className="orw__trace" key={`${r.t}-${r.x}-${i}`}>
                      <div className="orw__trace-head">
                        <div
                          className="orw__trace-label"
                          style={{ color: kd.color }}
                        >
                          {kd.label}
                        </div>
                        <div className="orw__trace-time">{r.t}</div>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          className={`orw__trace-text${
                            thinking ? " is-thinking" : ""
                          }${tool ? " is-tool" : ""}`}
                        >
                          {r.x}
                        </div>
                        {r.badge ? (
                          <div className="orw__trace-meta">
                            <span
                              className="orw__badge"
                              style={{
                                color:
                                  r.badge === "BLOCK" ? "#8C1027" : "#4B7A5C",
                              }}
                            >
                              {r.badge}
                            </span>
                            <span className="orw__badge-note">{r.meta}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                <div className="orw__status">
                  <span>
                    {done
                      ? "engagement complete · 26 findings written to the target graph"
                      : "orwell is reasoning"}
                  </span>
                  <span className="orw__caret" aria-hidden />
                </div>
              </div>

              <div className="orw__nudge">
                <span className="orw__label">NUDGE</span>
                <input
                  type="text"
                  value={nudge}
                  onChange={(e) => setNudge(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendNudge();
                  }}
                  placeholder="Steer the agent, e.g. also try /admin/v1"
                  aria-label="Steer the agent"
                />
                <button type="button" className="orw__send" onClick={sendNudge}>
                  SEND
                </button>
              </div>
            </div>
          ) : (
            <div className="orw__detail">
              <div className="orw__detail-head">
                <span
                  className="orw__chip"
                  style={{
                    background: selSev.chipBg,
                    color: selSev.chipText,
                    padding: "3px 7px",
                  }}
                >
                  {sel.sev}
                </span>
                <span className="orw__detail-meta">
                  CONFIDENCE {sel.confidence} · STATUS {sel.status}
                </span>
              </div>
              <h3>{sel.title}</h3>

              <div className="orw__analysis">
                <div className="orw__analysis-head">
                  <i />
                  <span>ORWELL · ANALYSIS</span>
                </div>
                <p>{sel.analysis}</p>
              </div>

              <div className="orw__pair">
                <div className="orw__box">
                  <div className="orw__box-head">
                    <span>REQUEST</span>
                  </div>
                  <div className="orw__box-body">{sel.request}</div>
                </div>
                <div className="orw__box">
                  <div className="orw__box-head">
                    <span>RESPONSE</span>
                    <span className="orw__hit">HIT</span>
                  </div>
                  <div className="orw__box-body">{sel.response}</div>
                </div>
              </div>

              <div className="orw__cls">
                <div>
                  <div className="orw__label" style={{ marginBottom: 12 }}>
                    CLASSIFICATION
                  </div>
                  <div className="orw__cls-rows">
                    <div>
                      <span>CWE</span>
                      <span>{sel.cwe}</span>
                    </div>
                    <div>
                      <span>OWASP</span>
                      <span>{sel.owasp}</span>
                    </div>
                    <div>
                      <span>Surface</span>
                      <span>{sel.surface}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="orw__label" style={{ marginBottom: 12 }}>
                    REMEDIATION
                  </div>
                  <div className="orw__fix">
                    <div className="orw__fix-title">{sel.fixTitle}</div>
                    <p>{sel.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---- live status rail ---- */}
        <div className="orw__rail orw__rail--right">
          <div className="orw__label">LIVE STATUS</div>
          <dl className="orw__counters">
            <div className="orw__counter">
              <dt>ENDPOINTS</dt>
              <dd>16</dd>
            </div>
            <div className="orw__counter">
              <dt>FINDINGS</dt>
              <dd className="is-alert">{shown}</dd>
            </div>
            <div className="orw__counter">
              <dt>ACTIONS</dt>
              <dd>{12 + tools * 6}</dd>
            </div>
            <div className="orw__counter">
              <dt>GUARD BLOCKS</dt>
              <dd>{guards}</dd>
            </div>
          </dl>

          <div className="orw__label">COVERAGE</div>
          <div className="orw__cov">
            <i style={{ width: `${coverage.toFixed(0)}%` }} />
          </div>
          <div className="orw__cov-label">
            {coverage.toFixed(0)}% · union of all rounds
          </div>

          <div className="orw__label">RUN INFO</div>
          <div className="orw__info">
            {runInfo.map(([k, v]) => (
              <div key={k}>
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>

          <div className="orw__notice">
            <div className="orw__notice-head">GUARD NOTICE</div>
            <p>
              {guards > 0
                ? `${guards} action(s) refused before leaving the sandbox. Each refusal is logged with its reason and returned to the agent.`
                : "No refusals yet. Every outbound request is checked against the authorised scope before it is issued."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
