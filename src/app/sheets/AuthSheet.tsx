import { useEffect, useState } from "react";
import { useAppShell } from "../AppProvider";

export function AuthSheet() {
  const shell = useAppShell();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") shell.closeAuth();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shell]);

  if (!shell.authOpen) return null;
  const isSignup = shell.authMode !== "login";
  const ready = !!(email && password);

  const close = () => {
    shell.closeAuth();
    setName(""); setEmail(""); setPassword("");
  };
  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    try {
      await shell.submitAuth({ name, email, password });
      setName(""); setEmail(""); setPassword("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end" }}
      onClick={close}
    >
      <div className="a-auth-sheet" role="dialog" aria-modal="true" aria-labelledby="appauth-title" onClick={(e) => e.stopPropagation()}>
        <div className="a-sheet-handle" />
        <h3 className="a-sheet-title" id="appauth-title">{isSignup ? "Create your account" : "Welcome back"}</h3>
        <p className="a-sheet-sub">
          {isSignup ? "Sign up to connect with listeners and hosts." : "Log in to continue your conversations."}
        </p>
        <div className="a-auth-tabs" role="tablist">
          <button className="a-auth-tab" role="tab" aria-selected={isSignup} onClick={() => shell.setAuthMode("signup")}>Sign up</button>
          <button className="a-auth-tab" role="tab" aria-selected={!isSignup} onClick={() => shell.setAuthMode("login")}>Log in</button>
        </div>
        {isSignup && (
          <input className="a-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <input className="a-input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="a-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="a-auth-submit" onClick={submit} disabled={!ready || busy}>
          {busy ? "…" : isSignup ? "Create account" : "Log in"}
        </button>
        <p className="a-auth-foot">Your conversations stay private. You can leave any time.</p>
      </div>
    </div>
  );
}
