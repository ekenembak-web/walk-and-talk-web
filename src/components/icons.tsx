export function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z" />
    </svg>
  );
}

export function PinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function TwoWalkersDoodle({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <svg style={style} width="72" height="40" viewBox="0 0 72 40" fill="none" aria-hidden="true">
      <circle cx="14" cy="8" r="4" stroke={color} strokeWidth="2" />
      <path d="M14 13c-5 0-7 4-7 9l1 12M14 13c5 0 7 4 7 9l-2 12M9 22h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="6" r="4" stroke={color} strokeWidth="2" />
      <path d="M40 11c-5 0-7 4-7 9l1 14M40 11c5 0 7 4 7 9l-2 14M35 20h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M56 10c4-3 9-1 9 3s-4 5-4 5 6 0 8 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SquiggleDoodle({ color }: { color: string }) {
  return (
    <svg className="doodle-squiggle" width="130" height="16" viewBox="0 0 130 16" fill="none" aria-hidden="true">
      <path d="M2 12c9-10 17-10 26 0s17 10 26 0 17-10 26 0 17 10 26 0 17-10 22-2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ListenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function ConnectIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s-7-4.35-9.33-8.94C1.2 8.7 3 5 6.5 5c2 0 3.3 1.1 4 2.2C11.2 6.1 12.5 5 14.5 5 18 5 19.8 8.7 18.33 12.06 16 16.65 12 21 12 21z" />
    </svg>
  );
}

export function HostIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

export function HeartDoodle() {
  return (
    <svg width="34" height="30" viewBox="0 0 34 30" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <path d="M17 27C6 20 2 14 2 9c0-4 3-7 7-7 3.5 0 6 2 8 5 2-3 4.5-5 8-5 4 0 7 3 7 7 0 5-4 11-15 18z" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
