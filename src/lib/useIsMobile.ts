import { useEffect, useState } from "react";

/**
 * Which seeker shell to render. The handoff ships the seeker web and seeker
 * mobile as separate designs (different nav, different information architecture),
 * not responsive variants — so we switch shells at a breakpoint rather than
 * reflowing one layout.
 */
const QUERY = "(max-width: 768px)";

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}
