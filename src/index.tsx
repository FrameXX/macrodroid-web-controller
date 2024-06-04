import React from "react";
import ReactDOM from "react-dom/client";
import R_App from "./App.tsx";
import { hideSplashscreen } from "./modules/elements.ts";
import { MotionConfig } from "framer-motion";

const prefersReducedMotion = matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const transitions = {
  duration: prefersReducedMotion ? 0.000001 : 0.5,
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
  }, 300);
});
