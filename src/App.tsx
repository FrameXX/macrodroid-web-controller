import { useEffect, useState } from "react";
import { Toast, Toaster } from "./modules/toaster";
import R_Toaster from "./components/Toaster/Toaster";
import "./App.scss";
import R_Nav from "./components/Nav/Nav";
import R_FAB from "./components/FAB/FAB";
import { NavTabId } from "./components/Nav/Nav";
import R_PairDeviceWizard from "./components/PairDeviceWizard/PairDeviceWizard";
import useWideScreen from "./modules/useWideScreen";
import { TargetAndTransition, motion } from "framer-motion";

const toaster = new Toaster();
let initiated = false;

function R_App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeNavTabId, setActiveNavTabId] = useState<NavTabId>("connections");
  const [addDeviceWizardOpen, setAddDeviceWizardOpen] = useState(false);

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

  const devicesTabStyle: React.CSSProperties = {
    display: activeNavTabId === "connections" ? "block" : "none",
  };

  const wideScreen = useWideScreen();

  const animate: TargetAndTransition = wideScreen
    ? { flexDirection: "column" }
    : { flexDirection: "row-reverse" };

  return (
    <motion.main layout animate={animate}>
      <div id="tab-content">
        <section style={devicesTabStyle} className="tab">
          <div id="no-connections">
            <div id="no-connections-face">¯\_(ツ)_/¯</div>
            Welcome fellow MacroDroid enthusiast! Pair a new device using the
            button with plus icon.
          </div>
          <R_FAB
            title="Pair a new device"
            onClick={() => setAddDeviceWizardOpen(true)}
            iconId="plus"
          />
          <R_PairDeviceWizard
            bakeToast={bakeToast}
            onClose={() => setAddDeviceWizardOpen(false)}
            open={addDeviceWizardOpen}
          />
        </section>
      </div>
      <R_Nav
        defaultNavTabId={activeNavTabId}
        onTabSwitch={(newNavTabId: NavTabId) => {
          setActiveNavTabId(newNavTabId);
        }}
      />
      <R_Toaster onToastClick={removeToast} toasts={toasts} />
    </motion.main>
  );
}

export default R_App;
