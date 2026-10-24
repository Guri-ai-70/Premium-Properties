import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "@/App";
import { seedData } from "@/entities/seed";
import "./index.css";
import "./fonts.css";

// Land on the listings route before React mounts. The <Navigate> at "/" redirects
// in an effect that runs after the first paint, which painted the header and
// footer with an empty page between them.
if (!window.location.hash || window.location.hash === "#/") {
  window.history.replaceState(null, "", "#/Properties");
}

// Populate first-run demo data before the app mounts.
seedData();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Opt in to React Router v7 behavior now (silences the dev-console warnings). */}
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
  </React.StrictMode>
);
