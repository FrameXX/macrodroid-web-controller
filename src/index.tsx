import React from "react";
import ReactDOM from "react-dom/client";
import { R_App } from "./App.tsx";
import { hideSplashscreen } from "./modules/elements.ts";
import { MotionConfig } from "framer-motion";
import { SPLASHSCREEN_TIMEOUT_MS, TRANSITIONS } from "./modules/const.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig transition={TRANSITIONS}>
      <R_App />
    </MotionConfig>
  </React.StrictMode>,
);

addEventListener("load", () => {
  setTimeout(() => {
    hideSplashscreen();
  }, SPLASHSCREEN_TIMEOUT_MS);
});
