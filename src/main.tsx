import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/mobile.css";
import "./app/app.css";
import "./listener/listener.css";
import "./moderator/moderator.css";
import "./dev/dev-switcher.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
