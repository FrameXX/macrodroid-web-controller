import React from "react";
import ReactDOM from "react-dom/client";
import R_App from "./App.tsx";
import { hideSplashscreen } from "./modules/elements.ts";
import { MotionConfig } from "framer-motion";
import {
  defaultTransitionDurationS,
  splashscreenTimeoutMs,
} from "./modules/const.ts";

const prefersReducedMotion = matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const transitions = {
  duration: prefersReducedMotion ? 0.000001 : defaultTransitionDurationS,
  bounce: 0.4,
  type: "spring",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig transition={transitions}>
      <R_App />
    </MotionConfig>
  </React.StrictMode>,
);

addEventListener("load", () => {
  setTimeout(() => {
    hideSplashscreen();
  }, splashscreenTimeoutMs);
});
