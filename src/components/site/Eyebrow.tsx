/**
 * Section label. Renders either the crimson tick (`bar`) or a numeral plus an
 * animated hairline, matching the two treatments used across the site.
 */
export default function Eyebrow({
  children,
  num,
  dark = false,
  tint,
  className = "",
}: {
  children: React.ReactNode;
  num?: string;
  dark?: boolean;
  /** Overrides the crimson tick, e.g. the teal one on the CI section. */
  tint?: string;
  className?: string;
}) {
  return (
    <div className={`eyebrow${dark ? " eyebrow--dark" : ""} ${className}`}>
      {num ? (
        <>
          <span className="eyebrow__num">{num}</span>
          <span className="eyebrow__rule rule-anim" />
        </>
      ) : (
        <span className="eyebrow__bar" style={tint ? { background: tint } : undefined} />
      )}
      <span className="eyebrow__text">{children}</span>
    </div>
  );
}
