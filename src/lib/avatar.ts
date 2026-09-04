/**
 * Deterministic initials avatar as an inline SVG data URI.
 * Same name -> same hue. Parentheses are percent-escaped so the data URI
 * survives being dropped into CSS `url(...)`.
 */
export function avatarUri(name: string): string {
  const n = String(name || "?");
  const initials = n
    .replace(/,.*$/, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  let h = 0;
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
  const hues = [196, 168, 146, 24, 258, 336];
  const hue = hues[h % hues.length];

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480">' +
    `<rect width="480" height="480" fill="hsl(${hue},32%,84%)"/>` +
    `<text x="240" y="303" font-family="Georgia, serif" font-size="180" font-weight="400" fill="hsl(${hue},38%,30%)" text-anchor="middle">${initials}</text>` +
    "</svg>";

  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svg).replace(/\(/g, "%28").replace(/\)/g, "%29")
  );
}

/** avatar for a person: explicit photo, else the initials fallback. */
export function personAvatar(p: { name: string; avatar?: string }): string {
  return p.avatar || avatarUri(p.name);
}
