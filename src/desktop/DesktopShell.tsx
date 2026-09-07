import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WelcomeOverlay } from "../components/WelcomeOverlay";
import { ChatDock } from "./ChatDock";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { FindPage } from "../pages/FindPage";
import { BecomeListenerPage } from "../pages/BecomeListenerPage";
import { BecomeHostPage } from "../pages/BecomeHostPage";
import { SafetyPage } from "../pages/SafetyPage";
import { MessagesPage } from "../pages/MessagesPage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { GuidelinesPage } from "../pages/GuidelinesPage";

/** Seeker desktop web — persistent header, 9 pages. */
export function DesktopShell() {
  return (
    <>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/find" element={<FindPage />} />
          <Route path="/become" element={<BecomeListenerPage />} />
          <Route path="/host" element={<BecomeHostPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          {/* mobile-only routes fall back to their desktop equivalent */}
          <Route path="/explore" element={<Navigate to="/" replace />} />
          <Route path="/howitworks" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
      <WelcomeOverlay />
      <ChatDock />
    </>
  );
}
