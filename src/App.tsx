import { useEffect, useState } from "react";
import { Toast, Toaster } from "./modules/toaster";
import R_Toaster from "./components/Toaster/Toaster";
import "./App.scss";
import R_Nav from "./components/Nav/Nav";
import R_FAB from "./components/FAB/FAB";

const toaster = new Toaster();
let initiated = false;

function R_App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function bakeToast(toast: Toast) {
    toaster.bake(toast, setToasts);
  }

  function removeToast(id: number) {
    toaster.removeToastById(id, setToasts);
  }

  function init() {
    bakeToast(new Toast("Hi there!", "plus"));
  }

  useEffect(() => {
    if (initiated) return;
    initiated = true;
    init();
  }, []);

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
      <R_Toaster onToastClick={removeToast} toasts={toasts} />
    </>
  );
}

export default R_App;
