import { useMemo, useState } from "react";
import { Toast } from "./modules/toaster";
import R_Toaster from "./components/Toaster/Toaster";
import { App } from "./modules/app";
import "./App.scss";
import R_Nav from "./components/Nav/Nav";
import R_FAB from "./components/FAB/FAB";

export interface AppState {
  toasts: Toast[];
}

function R_App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const app = useMemo(() => new App({ setToasts }), []);

  return (
    <>
      <div id="tab-content-filler">
        <div id="tab-content">
          <div id="no-devices">
            <div id="no-devices-face">¯\_(ツ)_/¯</div>
            Welcome fellow MacroDroid enthusiast! Pair a new device using the
            button with plus icon.
          </div>
          <R_FAB title="Pair a new device" onClick={() => {}} iconId="plus" />
        </div>
      </div>
      <R_Nav defaultNavTabId="devices" />
      <R_Toaster toaster={app.toaster} toasts={toasts} />
    </>
  );
}

export default R_App;
