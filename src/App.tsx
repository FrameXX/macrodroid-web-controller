import { useEffect, useRef } from "react";
import { Toast, ToastSeverity, Toaster } from "./modules/toaster";
import R_Toaster from "./components/Toaster/Toaster";
import "./App.scss";
import R_Nav from "./components/Nav/Nav";
import R_FAB from "./components/FAB/FAB";
import { NavTabId } from "./components/Nav/Nav";
import R_CreateConnectionWizard from "./components/CreateConnectionWizard/CreateConnectionWizard";
import useInnerSize from "./modules/use_inner_size";
import { AnimatePresence, Target, motion } from "framer-motion";
import { Connection } from "./modules/connection";
import {
  LogRecord,
  LogRecordInitializer,
  LogRecordType,
} from "./components/LogRecord/LogRecord";
import R_Log from "./components/Log/Log";
import { generateReadableTimestamp } from "./modules/readable_timestamp";
import R_BigNotice from "./components/BigNotice/BigNotice";
import R_Connection from "./components/Connection/Connection";
import { IncomingRequest } from "./modules/incoming_request";
import { Random } from "./modules/random";
import R_Tab from "./components/Tab/Tab";
import { useImmer } from "use-immer";

let initiated = false;

function R_App() {
  const [toasts, setToasts] = useImmer<Toast[]>([]);
  const [activeNavTabId, setActiveNavTabId] = useImmer<NavTabId>(
    NavTabId.Connections,
  );
  const [addConnectionWizardOpen, setAddConnectionWizardOpen] = useImmer(false);
  const [connections, setConnections] = useImmer<Connection[]>([]);
  const [logRecords, setLogRecords] = useImmer<LogRecord[]>([]);
  const [logTabScrollPx, setLogTabScrollPx] = useImmer(0);

  const logScrollableContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logScrollableContainer.current) {
      console.warn("Logs scrollable container not found.");
      return;
    }
    const container = logScrollableContainer.current;

    function onScroll() {
      setLogTabScrollPx(container.scrollTop);
    }

    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, []);

  function scrollLogTop() {
    const logsContainer = document.getElementById("logs");
    if (!logsContainer) {
      console.warn("Logs container not found.");
      return;
    }
    logsContainer.children[0].scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }

  function addConnection(connection: Connection, restored = false) {
    if (!restored) setAddConnectionWizardOpen(false);
    setConnections((prevConnections) => {
      prevConnections.push(connection);
      return prevConnections;
    });
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
    const id = Random.id();
    const logRecord: LogRecord = {
      ...record,
      timestamp,
      readableTimestamp,
      filterString,
      id,
    };
    setLogRecords((prevLogRecords) => {
      prevLogRecords.unshift(logRecord);
      return prevLogRecords;
    });
  }

  function deleteConnection(connection: Connection) {
    if (connection.listening) connection.stopListeningRequests();
    setConnections((prevConnections) => {
      const index = prevConnections.indexOf(connection);
      prevConnections.splice(index, 1);
      return prevConnections;
    });
  }

  async function pokeConnection(connection: Connection) {
    const request = Connection.newPokeRequest();
    const requestLog = await connection.makeRequest(request);
    log(requestLog);

    if (requestLog.errorMessage) {
      bakeToast(
        new Toast(
          `Failed to poke connection. ${request.errorMessage}`,
          "alert",
        ),
      );
      return;
    } else {
      bakeToast(
        new Toast(
          "Activity evidence requested.",
          "transit-connection-variant",
          ToastSeverity.Success,
        ),
      );
    }
  }

  const toaster = useRef(new Toaster(setToasts));

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

  const wideScreen = useInnerSize();

  const animate: Target = wideScreen
    ? { flexDirection: "row-reverse" }
    : { flexDirection: "column" };

  return (
    <motion.main layout animate={animate}>
      <div id="tab-content">
        <R_Tab active={activeNavTabId === NavTabId.Connections}>
          <R_BigNotice hidden={connections.length > 0}>
            No connections configured
          </R_BigNotice>
          <div id="connections">
            <AnimatePresence>
              {connections.map((connection) => (
                <R_Connection
                  onPoke={() => {
                    pokeConnection(connection);
                  }}
                  onDelete={() => {
                    deleteConnection(connection);
                  }}
                  connection={connection}
                  key={connection.id}
                />
              ))}
            </AnimatePresence>
          </div>
          <R_FAB
            title="Create new connection"
            onClick={() => setAddConnectionWizardOpen(true)}
            iconId="plus"
          />
          <R_CreateConnectionWizard
            log={log}
            onConnectionAdd={addConnection}
            bakeToast={bakeToast}
            onClose={() => setAddConnectionWizardOpen(false)}
            open={addConnectionWizardOpen}
          />
        </R_Tab>
        <R_Tab
          ref={logScrollableContainer}
          active={activeNavTabId === NavTabId.Log}
        >
          <R_Log
            onScrollUp={scrollLogTop}
            containerScrollPx={logTabScrollPx}
            logRecords={logRecords}
          />
        </R_Tab>
      </div>
      <R_Nav
        activeNavTabId={activeNavTabId}
        onTabSwitch={(newNavTabId: NavTabId) => setActiveNavTabId(newNavTabId)}
      />
      <R_Toaster onToastClick={removeToast} toasts={toasts} />
    </motion.main>
  );
}

export default R_App;
