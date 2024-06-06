import { useEffect, useState } from "react";
import { Toast, Toaster } from "./modules/toaster";
import R_Toaster from "./components/Toaster/Toaster";
import "./App.scss";
import R_Nav from "./components/Nav/Nav";
import R_FAB from "./components/FAB/FAB";
import { NavTabId } from "./components/Nav/Nav";
import R_CreateConnectionWizard from "./components/CreateConnectionWizard/CreateConnectionWizard";
import useWideScreen from "./modules/useWideScreen";
import { TargetAndTransition, motion } from "framer-motion";
import { Connection } from "./modules/connection";
import { defaultTransitionOffset } from "./modules/const";
import { notifyError } from "./modules/notify_error";

const toaster = new Toaster();
let initiated = false;

function R_App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeNavTabId, setActiveNavTabId] = useState<NavTabId>("connections");
  const [addConnectionWizardOpen, setAddConnectionWizardOpen] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  // @ts-ignore
  const [connectionConfirmed, setConnectionConfirmed] = useState(false);
  const [connectionAddRequestId, setConnectionAddRequestId] = useState(0);

  function onClosePairConnectionWizard() {
    setAddConnectionWizardOpen(false);
  }

  function onConnectionAdd(connection: Connection) {
    setConnections([connection, ...connections]);
    const id = connection.request("add", [], (statusText) => {
      const errorText = `Failed to request connection confirmation. ${statusText}.`;
      notifyError(errorText, bakeToast);
    });
    setConnectionAddRequestId(id);
  }

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

  const animateConnectionsTab: TargetAndTransition =
    activeNavTabId === "connections"
      ? {}
      : { y: -defaultTransitionOffset, opacity: 0, display: "none" };

  const wideScreen = useWideScreen();

  const animate: TargetAndTransition = wideScreen
    ? { flexDirection: "row-reverse" }
    : { flexDirection: "column" };

  return (
    <motion.main layout animate={animate}>
      <div id="tab-content">
        <motion.section animate={animateConnectionsTab} className="tab">
          <div id="no-connections">
            <div id="no-connections-face">¯\_(ツ)_/¯</div>
            Welcome fellow MacroDroid enthusiast! Pair a new connection using
            the button with plus icon.
          </div>
          <R_FAB
            title="Create new connection"
            onClick={() => setAddConnectionWizardOpen(true)}
            iconId="plus"
          />
          <R_CreateConnectionWizard
            connectionAddRequestId={connectionAddRequestId}
            onConnectionAdd={onConnectionAdd}
            bakeToast={bakeToast}
            onClose={onClosePairConnectionWizard}
            open={addConnectionWizardOpen}
          />
        </motion.section>
      </div>
      <R_Nav
        navTabId={activeNavTabId}
        onTabSwitch={(newNavTabId: NavTabId) => {
          setActiveNavTabId(newNavTabId);
        }}
      />
      <R_Toaster onToastClick={removeToast} toasts={toasts} />
    </motion.main>
  );
}

export default R_App;
