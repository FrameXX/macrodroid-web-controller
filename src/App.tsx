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
  LogRecordType,
} from "./components/LogRecord/LogRecord";
import R_Log from "./components/Log/Log";
import { generateReadableTimestamp } from "./modules/readable_timestamp";
import { useReactive } from "./modules/reactive";
import R_BigNotice from "./components/BigNotice/BigNotice";
import R_Connection from "./components/Connection/Connection";
import { IncomingRequest } from "./modules/incoming_request";

let initiated = false;

function R_App() {
  const toasts = useReactive<Toast[]>([]);
  const activeNavTabId = useReactive<NavTabId>(NavTabId.Connections);
  const addConnectionWizardOpen = useReactive<boolean>(false);
  const connections = useReactive<Connection[]>([]);
  const logRecords = useReactive<LogRecord[]>([]);

  function addConnection(connection: Connection, restored = false) {
    if (!restored) addConnectionWizardOpen.value = false;
    connections.value.push(connection);
    connection.listenRequests(
      (request) => {
        handleIncomingRequest(request, connection);
      },
      (errorMessage) => {
        handleIncomingFailedRequest(errorMessage, connection);
      },
      () => {
        handleListenFailed(connection);
      },
    );
  }

  function handleIncomingRequest(
    request: IncomingRequest,
    connection: Connection,
  ) {
    log({
      connectionName: connection.name,
      requestId: request.id,
      response: true,
      type: LogRecordType.IncomingRequest,
    });
  }

  function handleIncomingFailedRequest(
    errorMessage: string,
    connection: Connection,
  ) {
    log({
      connectionName: connection.name,
      response: false,
      type: LogRecordType.IncomingRequest,
      errorMessage,
    });
  }

  function handleListenFailed(connection: Connection) {
    log({
      connectionName: connection.name,
      response: false,
      type: LogRecordType.IncomingRequest,
    });
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
      logRecordInitializer.comment?.toLowerCase() +
      logRecordInitializer.details?.join("").toLowerCase() +
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
    logRecords.value.unshift(logRecord);
  }

  const toaster = useRef(new Toaster(toasts));

  function bakeToast(toast: Toast) {
    toaster.current.bake(toast);
  }

  function removeToast(id: number) {
    toaster.current.removeToastById(id);
  }

  function init() {
    // addConnection(new Connection("Test Connection", "test-connection"));
    log({
      connectionName: "Test Connection",
      response: false,
      type: LogRecordType.Other,
      comment: "Create connection",
      details: [
        "Connection was created. The detail could get really long and the user should be able to see it properly at all screen sizes. Connection was created. The detail could get really long and the user should be able to see it properly at all screen sizes. Connection was created. The detail could get really long and the user should be able to see it properly at all screen sizes.",
        "And another much shorter string.",
      ],
      requestId: "ropaf",
    });
    log({
      errorMessage: "Error message",
      type: LogRecordType.Other,
      comment: "Error comment",
      connectionName: "Test Connection",
      response: false,
      requestId: "ropaf",
    });
  }

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
          animate={animateTab(NavTabId.Connections)}
          className="tab"
        >
          <div>
            {connections.value.map((connection) => (
              <R_Connection connection={connection} key={connection.id} />
            ))}
            <R_BigNotice hidden={connections.value.length > 0}>
              No connections configured
            </R_BigNotice>
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
          animate={animateTab(NavTabId.Log)}
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
