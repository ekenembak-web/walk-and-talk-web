import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AppProvider } from "./state/store";
import { useIsMobile } from "./lib/useIsMobile";
import { DesktopShell } from "./desktop/DesktopShell";
import { MobileShell } from "./mobile/MobileShell";
import { AuthModal } from "./components/AuthModal";
import { AppShell } from "./app/AppShell";
import { ListenerWebShell } from "./listener/ListenerWebShell";
import { ListenerAppShell } from "./listener/ListenerAppShell";
import { ModeratorConsole } from "./moderator/ModeratorConsole";

/** Reset scroll on navigation, unless we're targeting an in-page anchor. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** The responsive seeker website: desktop or mobile shell by viewport. Each
 *  shell renders its own chat surface (docked widget vs. full-screen thread). */
function WebShell() {
  const mobile = useIsMobile();
  return (
    <>
      {mobile ? <MobileShell /> : <DesktopShell />}
      <AuthModal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider requireAccountToBrowse={false}>
      <ScrollToTop />
      <Routes>
        {/* Listener role */}
        <Route path="/listener/app/*" element={<ListenerAppShell />} />
        <Route path="/listener/*" element={<ListenerWebShell />} />
        {/* Moderator role */}
        <Route path="/moderator/*" element={<ModeratorConsole />} />
        {/* Seeker role */}
        <Route path="/app/*" element={<AppShell />} />
        <Route path="/*" element={<WebShell />} />
      </Routes>
    </AppProvider>
  );
}
