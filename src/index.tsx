import React from "react";
import ReactDOM from "react-dom/client";
import R_App from "./App.tsx";
import { hideSplashscreen } from "./modules/elements.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <R_App />
  </React.StrictMode>,
);

addEventListener("load", hideSplashscreen);
