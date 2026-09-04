/** The W&T / ALK stacked wordmark. `size` scales the big "ALK". */
export function Logo({ big = 44 }: { big?: number }) {
  return (
    <span className="logo-row" aria-label="Walk&Talk" style={{ pointerEvents: "none" }}>
      <span className="logo-stack" aria-hidden="true">
        <span className="l1">W</span>
        <span className="l2">&amp;</span>
        <span className="l3">T</span>
      </span>
      <span className="logo-big" style={{ fontSize: big }} aria-hidden="true">
        ALK
      </span>
    </span>
  );
}
