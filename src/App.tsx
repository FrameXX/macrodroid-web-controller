import { useEffect, useState } from "react";
import { Toast, Toaster } from "./modules/toaster";
import R_Toaster from "./components/Toaster/Toaster";
import "./App.scss";
import R_Nav from "./components/Nav/Nav";
import R_FAB from "./components/FAB/FAB";
import { NavTabId } from "./components/Nav/Nav";
import R_CreateConnectionWizard from "./components/CreateConnectionWizard/CreateConnectionWizard";
import useInnerSize from "./modules/use_inner_size";
import { TargetAndTransition, motion } from "framer-motion";
import { Connection } from "./modules/connection";
import { DEFAULT_TRANSITION_OFFSET } from "./modules/const";
import {
  LogRecord,
  LogRecordInitializer,
} from "./components/LogRecord/LogRecord";
import R_Log from "./components/Log/Log";
import { generateReadableTimestamp } from "./modules/readable_timestamp";

const toaster = new Toaster();
let initiated = false;

function R_App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeNavTabId, setActiveNavTabId] = useState<NavTabId>("connections");
  const [addConnectionWizardOpen, setAddConnectionWizardOpen] = useState(false);
  // @ts-ignore;
  const [connections, setConnections] = useState<Connection[]>([]);
  const [logRecords, setLogRecords] = useState<LogRecord[]>([]);

  function onClosePairConnectionWizard() {
    setAddConnectionWizardOpen(false);
  }

  function logRecordFilterString(
    logRecordInitializer: LogRecordInitializer,
    readableTimestamp: string,
  ) {
    return (
      readableTimestamp +
      logRecordInitializer.connectionName.toLowerCase() +
      logRecordInitializer.requestId?.toLowerCase() +
      logRecordInitializer.detail?.toLowerCase() +
      logRecordInitializer.errorMessage?.toLowerCase()
    );
  }

  function log(record: LogRecordInitializer) {
    const timestamp = Date.now();
    const readableTimestamp = generateReadableTimestamp(timestamp);
    const filterString = logRecordFilterString(record, readableTimestamp);
    const logRecord: LogRecord = {
      ...record,
      timestamp,
      readableTimestamp,
      filterString,
    };
    setLogRecords([...logRecords, logRecord]);
  }

  function bakeToast(toast: Toast) {
    toaster.bake(toast, setToasts);
  }

  function removeToast(id: number) {
    toaster.removeToastById(id, setToasts);
  }

  function init() {
    log({
      connectionName: "Mi Box",
      detail: "Some comment regarding this log.",
      response: true,
      requestId: "doti",
      incoming: true,
    });
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

  const wideScreen = useInnerSize();

  const animate: TargetAndTransition = wideScreen
    ? { flexDirection: "row-reverse" }
    : { flexDirection: "column" };

  return (
    <motion.main layout animate={animate}>
      <div id="tab-content">
        <motion.section animate={animateTab("connections")} className="tab">
          <div id="no-connections">
            <div id="no-connections-face">¯\_(ツ)_/¯</div>
            Welcome fellow MacroDroid enthusiast! Add a new connection using the
            button with plus icon.
          </div>
          <R_FAB
            title="Create new connection"
            onClick={() => setAddConnectionWizardOpen(true)}
            iconId="plus"
          />
          <R_CreateConnectionWizard
            log={log}
            onConnectionAdd={() => {}}
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
          <R_Log logRecords={logRecords} />
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
