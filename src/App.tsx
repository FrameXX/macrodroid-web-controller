import { useEffect, useRef } from "react";
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
import { Reactive } from "./modules/reactive";

let initiated = false;

function R_App() {
  const toasts = new Reactive<Toast[]>([]);
  const activeNavTabId = new Reactive<NavTabId>(NavTabId.CONNECTIONS);
  const addConnectionWizardOpen = new Reactive<boolean>(false);
  const connections = new Reactive<Connection[]>([]);
  const logRecords = new Reactive<LogRecord[]>([]);

  function addConnection(connection: Connection, restored = false) {
    if (!restored) addConnectionWizardOpen.value = false;
  }

  function onClosePairConnectionWizard() {
    addConnectionWizardOpen.value = false;
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
    logRecords.value.push(logRecord);
  }

  const toaster = useRef(new Toaster(toasts));

  function bakeToast(toast: Toast) {
    toaster.current.bake(toast);
  }

  function removeToast(id: number) {
    toaster.current.removeToastById(id);
  }

  function init() {}

  useEffect(() => {
    if (initiated) return;
    initiated = true;
    init();
  }, []);

  function animateTab(navTabId: NavTabId): TargetAndTransition {
    return navTabId === activeNavTabId.value
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
        <motion.section
          animate={animateTab(NavTabId.CONNECTIONS)}
          className="tab"
        >
          <div id="no-connections">
            <div id="no-connections-face">¯\_(ツ)_/¯</div>
            Welcome fellow MacroDroid enthusiast! Add a new connection using the
            button with plus icon.
          </div>
          <R_FAB
            title="Create new connection"
            onClick={() => (addConnectionWizardOpen.value = true)}
            iconId="plus"
          />
          <R_CreateConnectionWizard
            log={log}
            onConnectionAdd={addConnection}
            bakeToast={bakeToast}
            onClose={onClosePairConnectionWizard}
            open={addConnectionWizardOpen.value}
          />
        </motion.section>
        <motion.section
          id="log-tab"
          className="tab"
          animate={animateTab(NavTabId.LOG)}
        >
          <R_Log logRecords={logRecords.value} />
        </motion.section>
      </div>
      <R_Nav
        activeNavTabId={activeNavTabId.value}
        onTabSwitch={(newNavTabId: NavTabId) => {
          activeNavTabId.value = newNavTabId;
        }}
      />
      <R_Toaster onToastClick={removeToast} toasts={toasts.value} />
    </motion.main>
  );
}

export default R_App;
