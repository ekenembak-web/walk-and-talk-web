import { useState } from "react";
import { useApp } from "../state/store";
import { Modal } from "./Modal";
import * as api from "../data/api";

const onlyDigits = (v: string, max: number) => v.replace(/[^0-9]/g, "").slice(0, max);

function ageFromDob(day: string, month: string, year: string): number | null {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!d || !m || !y || year.length !== 4) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const now = new Date();
  let age = now.getFullYear() - y;
  const beforeBirthday =
    now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d);
  if (beforeBirthday) age -= 1;
  if (age < 0 || age > 120) return null;
  return age;
}

export function AuthModal() {
  const app = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState({ d: "", m: "", y: "" });
  const [busy, setBusy] = useState(false);

  if (!app.authOpen) return null;

  const isSignup = app.authMode === "signup";
  const age = ageFromDob(dob.d, dob.m, dob.y);
  const underage = age !== null && age < 18;
  const ready = isSignup
    ? !!(email && password && age !== null && age >= 18)
    : !!(email && password);

  const reset = () => {
    setName(""); setEmail(""); setPassword(""); setDob({ d: "", m: "", y: "" });
  };

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    try {
      const result = isSignup
        ? await api.signup({ name, email, password })
        : await api.login({ email, password });
      app.completeAuth(result);
      reset();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal onClose={() => { app.closeAuth(); reset(); }} labelledBy="auth-title">
      <h3 className="modal-title" id="auth-title">
        {isSignup ? "Create your account" : "Welcome back"}
      </h3>
      <p className="modal-sub">
        {isSignup
          ? "Sign up to request a conversation with a listener."
          : "Log in to continue your conversation."}
      </p>

      <div className="auth-tabs" role="tablist">
        <button className="auth-tab" role="tab" aria-selected={isSignup} onClick={() => app.setAuthMode("signup")}>
          Sign up
        </button>
        <button className="auth-tab" role="tab" aria-selected={!isSignup} onClick={() => app.setAuthMode("login")}>
          Log in
        </button>
      </div>

      {isSignup && (
        <div className="auth-field">
          <label className="label" htmlFor="auth-name">Name</label>
          <input id="auth-name" className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      )}

      {isSignup && (
        <div className="auth-field">
          <label className="label">Date of birth</label>
          <div className="dob-row">
            <input className="dob-input" inputMode="numeric" pattern="[0-9]*" maxLength={2} placeholder="DD" aria-label="Day of birth"
              value={dob.d} onChange={(e) => setDob({ ...dob, d: onlyDigits(e.target.value, 2) })} />
            <input className="dob-input" inputMode="numeric" pattern="[0-9]*" maxLength={2} placeholder="MM" aria-label="Month of birth"
              value={dob.m} onChange={(e) => setDob({ ...dob, m: onlyDigits(e.target.value, 2) })} />
            <input className="dob-input dob-input--year" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="YYYY" aria-label="Year of birth"
              value={dob.y} onChange={(e) => setDob({ ...dob, y: onlyDigits(e.target.value, 4) })} />
          </div>
          <p className={`dob-hint ${underage ? "dob-hint--warn" : ""}`}>
            {age === null ? "You must be 18 or over to use Walk & Talk." : underage ? "You are under 18." : "Thank you."}
          </p>
        </div>
      )}

      <div className="auth-field">
        <label className="label" htmlFor="auth-email">Email</label>
        <input id="auth-email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="auth-field">
        <label className="label" htmlFor="auth-pass">Password</label>
        <input id="auth-pass" className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {underage && (
        <div className="underage-card">
          <p className="underage-title">Walk &amp; Talk is for people 18 and over</p>
          <p className="underage-body">
            Our listeners are peers, not trained youth workers, so we cannot support under-18s safely.
            These services can, and they are free:
          </p>
          <div className="underage-lines">
            <div className="underage-line"><span>Vaikų linija</span><span className="underage-num">116 111</span></div>
            <div className="underage-line"><span>Jaunimo linija</span><span className="underage-num">8 800 28888</span></div>
          </div>
        </div>
      )}

      <button className="modal-submit" onClick={submit} disabled={!ready || busy}>
        {busy ? "…" : isSignup ? "Create account" : "Log in"}
      </button>
      <p className="modal-footer-text">
        By continuing you agree to Walk&amp;Talk's community and safety guidelines.
      </p>
    </Modal>
  );
}
