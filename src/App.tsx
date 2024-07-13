import { useEffect, useRef } from "react";
import { Toast, ToastSeverity, Toaster } from "./modules/toaster";
import { R_Toaster } from "./components/Toaster/Toaster";
import "./App.scss";
import { R_Nav } from "./components/Nav/Nav";
import { NavTabId } from "./components/Nav/Nav";
import { useInnerSize } from "./modules/use_inner_size";
import { Target, motion } from "framer-motion";
import { Connection, ConnectionsStruct } from "./modules/connection";
import { R_Log } from "./components/Log/Log";
import { IncomingRequest } from "./modules/incoming_request";
import { R_Tab } from "./components/Tab/Tab";
import { useImmer } from "use-immer";
import { R_ConfirmDialog } from "./components/ConfirmDialog/ConfirmDialog";
import {
  LogRecord,
  LogRecordInitializer,
  LogRecordsStruct,
  LogRecordType,
  Logger,
} from "./modules/logger";
import { ConfirmDialog } from "./modules/confirmDialog";
import { R_Connections } from "./components/Connections/Connections";
import { useLocalStorage } from "./modules/use_local_storage";
import { R_Actions } from "./components/Actions/Actions";
import { enums } from "superstruct";
import { R_WelcomeWizard } from "./components/WelcomeWizard/WelcomeWizard";
import { R_Extras } from "./components/Extras/Extras";

let initiated = false;

export function R_App() {
  const [toasts, setToasts] = useImmer<Toast[]>([]);
  const [activeNavTabId, setActiveNavTabId] = useImmer<NavTabId>(
    NavTabId.Connections,
  );
  const [connections, setConnections] = useImmer<Connection[]>([]);
  const [logRecords, setLogRecords] = useImmer<LogRecord[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useImmer(false);
  const [confirmDialogText, setConfirmDialogText] = useImmer("");
  const [logScrolledDown, setLogScrolledDown] = useImmer(false);

  useLocalStorage(logRecords, setLogRecords, {
    storageKey: "logRecords",
    struct: LogRecordsStruct,
    stringify: JSON.stringify,
    parse: JSON.parse,
    onRecoverError: (errorMessage) => {
      onRecoverError(errorMessage, "log records");
    },
    finalize: (logRecords) => {
      logger.current.logRecordsLen = logRecords.length;
      return logRecords;
    },
  });
  const saveConnections = useLocalStorage(
    connections,
    (connections) => connections.forEach(addConnection),
    {
      storageKey: "connections",
      struct: ConnectionsStruct,
      stringify: (connections) =>
        JSON.stringify(connections.map((connection) => connection.rawObject)),
      parse: JSON.parse,
      onRecoverError: (errorMessage) => {
        onRecoverError(errorMessage, "connections");
      },
      finalize: (connections) =>
        connections.map(
          (connection) =>
            new Connection(
              connection.name,
              connection.webhookId,
              connection.id,
              connection.lastActivityTimestamp,
            ),
        ),
    },
  );
  useLocalStorage(activeNavTabId, setActiveNavTabId, {
    storageKey: "activeNavTabId",
    struct: enums([
      NavTabId.Connections,
      NavTabId.Log,
      NavTabId.Actions,
      NavTabId.Extras,
    ]),
    stringify: (activeNavTabId) => activeNavTabId.toString(),
    parse: (activeNavTabId) => +activeNavTabId,
    onRecoverError: (errorMessage) => {
      onRecoverError(errorMessage, "active navigation tab");
    },
  });

  const toaster = useRef(new Toaster(setToasts));
  const logger = useRef(new Logger(setLogRecords));
  const confirmDialog = useRef(
    new ConfirmDialog(setConfirmDialogOpen, setConfirmDialogText),
  );
  const logScrollableContainer = useRef<HTMLDivElement>(null);
  const currentConnections = useRef<Connection[]>([]);
  useEffect(() => {
    if (!logScrollableContainer.current) {
      console.warn("Logs scrollable container not found.");
      return;
    }
    const container = logScrollableContainer.current;

    function onScroll() {
      setLogScrolledDown(container.scrollTop > innerHeight * 0.5);
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

  function onRecoverError(errorMessage: string, name: string) {
    const text = `Failed to recover ${name}. ${errorMessage}`;
    bakeToast(new Toast(text, "alert", ToastSeverity.Error));
    console.error(text);
  }

  function addConnection(connection: Connection) {
    setConnections((prevConnections) => {
      prevConnections.push(connection);
      return prevConnections;
    });
    currentConnections.current.push(connection);
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

  function reportConnectionActivity(activeConnection: Connection) {
    const activeConnectionIndex = currentConnections.current.findIndex(
      (connection) => connection.id === activeConnection.id,
    );
    if (activeConnectionIndex === -1) {
      console.warn(
        "Connection that was reported to be active could not be found in connections list.",
      );
      return;
    }

    setConnections((prevConnections) => {
      prevConnections[activeConnectionIndex].lastActivityTimestamp = Date.now();
      return prevConnections;
    });
    currentConnections.current[activeConnectionIndex].lastActivityTimestamp =
      Date.now();
    saveConnections(currentConnections.current);
  }

  function handleIncomingRequest(
    request: IncomingRequest,
    connection: Connection,
  ) {
    reportConnectionActivity(connection);
    log({
      connectionName: connection.name,
      requestId: request.id,
      response: true,
      type: LogRecordType.IncomingRequest,
      details: request.details,
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
    const errorMessage = "Failed to listen for incoming requests.";
    log({
      connectionName: connection.name,
      response: false,
      type: LogRecordType.Technicality,
      errorMessage: "Failed to listen for incoming requests.",
    });
    bakeToast(new Toast(errorMessage, "alert", ToastSeverity.Error));
  }

  async function deleteConnection(connection: Connection) {
    if (
      !(await confirm(
        `Are you sure you want to delete connection ${connection.name}? You will have to create it again if you want to use it.`,
      ))
    )
      return;
    if (connection.listening) connection.stopListeningRequests();
    setConnections((prevConnections) => {
      const index = prevConnections.indexOf(connection);
      prevConnections.splice(index, 1);
      return prevConnections;
    });
    currentConnections.current = currentConnections.current.filter(
      (currentConnection) => currentConnection.id !== connection.id,
    );
  }

  function bakeToast(toast: Toast) {
    toaster.current.bake(toast);
  }

  function log(record: LogRecordInitializer) {
    logger.current.log(record);
  }

  async function confirm(text: string) {
    return await confirmDialog.current.confirm(text);
  }

  function init() {}

  useEffect(() => {
    if (initiated) return;
    initiated = true;
    init();
  }, []);

  const wideScreen = useInnerSize(
    () => innerWidth > innerHeight && innerHeight > 500,
  );

  const animate: Target = wideScreen
    ? { flexDirection: "row-reverse" }
    : { flexDirection: "column" };

  return (
    <>
      <motion.main layout animate={animate}>
        <div id="tab-content">
          <R_Tab active={activeNavTabId === NavTabId.Connections}>
            <R_Connections
              reportConnectionActivity={reportConnectionActivity}
              connections={connections}
              onConnectionConfirm={addConnection}
              onConnectionDelete={deleteConnection}
              bakeToast={bakeToast}
              log={log}
            />
          </R_Tab>
          <R_Tab active={activeNavTabId === NavTabId.Actions}>
            <R_Actions
              onRecoverError={onRecoverError}
              connections={connections}
              log={log}
              bakeToast={bakeToast}
            />
          </R_Tab>
          <R_Tab
            ref={logScrollableContainer}
            active={activeNavTabId === NavTabId.Log}
          >
            <R_Log
              scrolledDown={logScrolledDown}
              onScrollUp={scrollLogTop}
              logRecords={logRecords}
              clearLog={logger.current.clear}
              confirm={confirm}
            />
          </R_Tab>
          <R_Tab active={activeNavTabId === NavTabId.Extras}>
            <R_Extras bakeToast={bakeToast} />
          </R_Tab>
        </div>
        <R_Nav
          activeNavTabId={activeNavTabId}
          onTabSwitch={(newNavTabId: NavTabId) =>
            setActiveNavTabId(newNavTabId)
          }
        />
      </motion.main>
      <R_WelcomeWizard bakeToast={bakeToast} />
      <R_ConfirmDialog
        open={confirmDialogOpen}
        onConfirm={() => confirmDialog.current.resolve(true)}
        onCancel={() => confirmDialog.current.resolve(false)}
        text={confirmDialogText}
      />
      <R_Toaster
        onToastClick={(id) => toaster.current.removeToastById(id)}
        toasts={toasts}
      />
    </>
  );
}
