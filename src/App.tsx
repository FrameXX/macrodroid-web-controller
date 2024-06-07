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
import { DEFAULT_TRANSITION_OFFSET } from "./modules/const";
import { notifyError } from "./modules/notify_error";
import R_LogEvent from "./components/LogEvent/LogEvent";

const toaster = new Toaster();
let initiated = false;

function R_App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeNavTabId, setActiveNavTabId] = useState<NavTabId>("connections");
  const [addConnectionWizardOpen, setAddConnectionWizardOpen] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionConfirmed, setConnectionConfirmed] = useState(false);
  const [connectionAddRequestId, setConnectionAddRequestId] = useState(0);

  function onClosePairConnectionWizard() {
    setAddConnectionWizardOpen(false);
  }

  function onConnectionAdd(connection: Connection) {
    setConnections([connection, ...connections]);
    const id = connection.request(
      "add",
      [],
      (statusText) => {
        const errorText = `Failed to request connection confirmation. Error ${statusText}.`;
        notifyError(errorText, bakeToast);
      },
      () => {
        bakeToast(
          new Toast(
            "Connection confirmation requested. Waiting for response.",
            "transit-connection-variant",
          ),
        );
      },
    );
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

  function animateTab(navTabId: NavTabId): TargetAndTransition {
    return navTabId === activeNavTabId
      ? {}
      : { y: -DEFAULT_TRANSITION_OFFSET, opacity: 0, display: "none" };
  }

  const wideScreen = useWideScreen();

  const animate: TargetAndTransition = wideScreen
    ? { flexDirection: "row-reverse" }
    : { flexDirection: "column" };

  return (
    <motion.main layout animate={animate}>
      <div id="tab-content">
        <motion.section animate={animateTab("connections")} className="tab">
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
        <motion.section
          id="log-tab"
          className="tab"
          animate={animateTab("log")}
        >
          <div>
            <div id="log-filter">
              <select />
              <input type="text" placeholder="Filter log..." />
            </div>
            <R_LogEvent />
          </div>
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
