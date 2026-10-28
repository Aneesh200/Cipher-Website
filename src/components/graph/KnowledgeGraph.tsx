"use client";

import { useMemo, useState } from "react";
import {
  EDGES,
  GRAPH_SEV,
  KIND_COLOR,
  KIND_LABEL,
  NODES,
  VIEW,
  type GraphNode,
  type NodeKind,
} from "@/data/graph";

const BY_ID = new Map(NODES.map((n) => [n.id, n]));
const KINDS = Object.keys(KIND_COLOR) as NodeKind[];

function neighbours(id: string) {
  const set = new Set<string>([id]);
  EDGES.forEach(([a, b]) => {
    if (a === id) set.add(b);
    if (b === id) set.add(a);
  });
  return set;
}

export default function KnowledgeGraph() {
  const [selected, setSelected] = useState("f2");
  const [hidden, setHidden] = useState<Partial<Record<NodeKind, boolean>>>({});
  const [query, setQuery] = useState("");

  const near = useMemo(() => neighbours(selected), [selected]);
  const q = query.trim().toLowerCase();

  const visible = (n: GraphNode) => {
    if (hidden[n.kind]) return false;
    if (q && !`${n.label} ${n.title} ${n.code ?? ""}`.toLowerCase().includes(q))
      return false;
    return true;
  };

  const sel = BY_ID.get(selected) ?? NODES[0];
  const sevInfo = sel.sev ? GRAPH_SEV[sel.sev] : null;
  const shown = NODES.filter(visible).length;

  const reset = () => {
    setSelected("f2");
    setHidden({});
    setQuery("");
  };

  return (
    <div className="kg">
      <div className="kg__head">
        <div>
          <div className="kg__eyebrow">CIPHER // KNOWLEDGE GRAPH</div>
          <div className="kg__title">One connected map of your estate</div>
          <div className="kg__stats">
            403 nodes · 2,182 edges · 20 cross links
            <br />
            {shown} of {NODES.length} nodes in view · 225 findings retained
          </div>
        </div>
        <div className="kg__controls">
          <input
            type="text"
            className="kg__search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search findings, hosts, CWE…"
            aria-label="Search the graph"
          />
          <button type="button" className="kg__reset" onClick={reset}>
            RESET VIEW
          </button>
        </div>
      </div>

      <div className="kg__body">
        <div className="kg__canvas">
          <div className="kg__plotwrap">
            <div className="kg__plot">
            <svg
              viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              {EDGES.map(([a, b], i) => {
                const A = BY_ID.get(a)!;
                const B = BY_ID.get(b)!;
                const active = near.has(a) && near.has(b);
                const dim = !visible(A) || !visible(B);
                return (
                  <line
                    key={`${a}-${b}`}
                    className="kg__edge"
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke={active ? "#8C1027" : "#C9CFD6"}
                    strokeWidth={active ? 1.6 : 1}
                    opacity={dim ? 0.06 : active ? 0.75 : 0.28}
                    style={{ animationDelay: `${i * 55}ms` }}
                  />
                );
              })}
            </svg>

            {NODES.map((n, i) => {
              const vis = visible(n);
              const isSel = n.id === selected;
              const opacity = !vis ? 0.08 : near.has(n.id) ? 1 : 0.3;
              const r = isSel ? n.r + 4 : n.r;
              const left = `${((n.x / VIEW.w) * 100).toFixed(3)}%`;
              const top = `${((n.y / VIEW.h) * 100).toFixed(3)}%`;
              return (
                <button
                  key={n.id}
                  type="button"
                  className="kg__node"
                  aria-label={n.label}
                  onClick={() => setSelected(n.id)}
                  style={{
                    left,
                    top,
                    width: r * 2,
                    height: r * 2,
                    marginLeft: -r,
                    marginTop: -r,
                    background: KIND_COLOR[n.kind],
                    border: isSel ? "3px solid #11161C" : "2px solid #FFFFFF",
                    boxShadow: isSel ? `0 0 0 6px ${KIND_COLOR[n.kind]}28` : "none",
                    opacity,
                    animationDelay: `${i * 45}ms`,
                  }}
                />
              );
            })}

            {NODES.map((n, i) => {
              const vis = visible(n);
              const isSel = n.id === selected;
              const opacity = !vis ? 0.08 : near.has(n.id) ? 1 : 0.3;
              const r = isSel ? n.r + 4 : n.r;
              return (
                <button
                  key={`l-${n.id}`}
                  type="button"
                  tabIndex={-1}
                  className="kg__nodelabel"
                  onClick={() => setSelected(n.id)}
                  style={{
                    left: `${((n.x / VIEW.w) * 100).toFixed(3)}%`,
                    top: `calc(${((n.y / VIEW.h) * 100).toFixed(3)}% + ${r + 8}px)`,
                    fontSize: isSel ? 12 : 10,
                    color: isSel ? "#11161C" : "#5A6473",
                    opacity,
                    animationDelay: `${i * 45}ms`,
                  }}
                >
                  {n.label}
                </button>
              );
            })}
            </div>
          </div>

          <div className="kg__legend">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                className="kg__key"
                aria-pressed={!hidden[k]}
                style={{ opacity: hidden[k] ? 0.32 : 1 }}
                onClick={() =>
                  setHidden((prev) => ({ ...prev, [k]: !prev[k] }))
                }
              >
                <i style={{ background: KIND_COLOR[k] }} />
                <span>{KIND_LABEL[k]}</span>
              </button>
            ))}
            <span className="kg__hint">
              CLICK A NODE TO FOCUS ITS NEIGHBOURHOOD · CLICK A LEGEND KEY TO
              FILTER
            </span>
          </div>
        </div>

        <div className="kg__panel">
          <div className="kg__panel-in" key={sel.id}>
            <div className="kg__kind">
              {KIND_LABEL[sel.kind]}
              {sel.code ? ` · ${sel.code}` : ""}
            </div>
            <div className="kg__name">{sel.title}</div>

            {sel.sev ? (
              <div className="kg__sev">
                <span
                  className="kg__sev-chip"
                  style={{
                    background: sevInfo?.chipBg ?? "#EFEFEC",
                    color: sevInfo?.chipText ?? "#5A6473",
                  }}
                >
                  {sel.sev}
                </span>
                <span className="kg__sev-code">{sel.code}</span>
              </div>
            ) : null}

            <div className="kg__rows">
              {sel.rows.map((r) => (
                <div key={r.k}>
                  <span>{r.k}</span>
                  <span>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="kg__body-label">{sel.bodyLabel}</div>
            <p className="kg__prose">{sel.body}</p>

            <div className="kg__foot">
              <div className="kg__foot-label">{sel.footLabel}</div>
              <p>{sel.foot}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
