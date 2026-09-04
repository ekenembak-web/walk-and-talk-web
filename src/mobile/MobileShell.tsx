import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MobileHeader } from "./MobileHeader";
import { MobileFooter } from "./MobileFooter";
import { MobileHome } from "./MobileHome";
import { ExplorePage } from "./ExplorePage";
import { MobileFindPage } from "./MobileFindPage";
import { HowItWorksPage } from "./HowItWorksPage";
import { MobileAboutPage } from "./MobileAboutPage";
import { MobileSafetyPage } from "./MobileSafetyPage";
import { MobilePrivacyPage } from "./MobilePrivacyPage";
import { MobileGuidelinesPage } from "./MobileGuidelinesPage";
import { MobileMessagesPage } from "./MobileMessagesPage";
import { MobileBecomeListenerPage } from "./MobileBecomeListenerPage";
import { MobileBecomeHostPage } from "./MobileBecomeHostPage";

/** Seeker mobile web — hamburger drawer, 11 pages, home is the welcome screen. */
export function MobileShell() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <div className="m-shell">
      <div className="m-page">
        <MobileHeader />
        <Routes>
          <Route path="/" element={<MobileHome />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/find" element={<MobileFindPage />} />
          <Route path="/become" element={<MobileBecomeListenerPage />} />
          <Route path="/host" element={<MobileBecomeHostPage />} />
          <Route path="/howitworks" element={<HowItWorksPage />} />
          <Route path="/about" element={<MobileAboutPage />} />
          <Route path="/safety" element={<MobileSafetyPage />} />
          <Route path="/privacy" element={<MobilePrivacyPage />} />
          <Route path="/guidelines" element={<MobileGuidelinesPage />} />
          <Route path="/messages" element={<MobileMessagesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!isHome && <MobileFooter />}
      </div>
    </div>
  );
}
