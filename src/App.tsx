import { useMemo, useState } from "react";
import { Toast } from "./modules/toaster";
import R_Toaster from "./components/Toaster/Toaster";
import { App } from "./modules/app";
import "./App.scss";

export interface AppState {
  toasts: Toast[];
}

function R_App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const app = useMemo(() => new App({ setToasts }), []);

  return (
    <>
      <R_Toaster toaster={app.toaster} toasts={toasts} />
    </>
  );
}

export default R_App;
