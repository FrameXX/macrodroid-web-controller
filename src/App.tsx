import { useEffect, useRef } from "react";
import { Toast, Toaster } from "./modules/toaster";
import R_Toaster from "./components/Toaster/Toaster";
import "./App.scss";
import R_Nav from "./components/Nav/Nav";
import { NavTabId } from "./components/Nav/Nav";
import useInnerSize from "./modules/use_inner_size";
import { Target, motion } from "framer-motion";
import { Connection } from "./modules/connection";
import R_Log from "./components/Log/Log";
import { IncomingRequest } from "./modules/incoming_request";
import R_Tab from "./components/Tab/Tab";
import { useImmer } from "use-immer";
import R_ConfirmDialog from "./components/ConfirmDialog/ConfirmDialog";
import {
  LogRecord,
  LogRecordInitializer,
  LogRecordType,
  Logger,
} from "./modules/logger";
import { ConfirmDialog } from "./modules/confirmDialog";
import R_Connections from "./components/Connections/Connections";

let initiated = false;

function R_App() {
  const [toasts, setToasts] = useImmer<Toast[]>([]);
  const [activeNavTabId, setActiveNavTabId] = useImmer<NavTabId>(
    NavTabId.Connections,
  );
  const [connections, setConnections] = useImmer<Connection[]>([]);
  const [logRecords, setLogRecords] = useImmer<LogRecord[]>([]);
  const [logTabScrollPx, setLogTabScrollPx] = useImmer(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useImmer(false);
  const [confirmDialogText, setConfirmDialogText] = useImmer("");

  const toaster = useRef(new Toaster(setToasts));
  const logger = useRef(new Logger(setLogRecords));
  const confirmDialog = useRef(
    new ConfirmDialog(setConfirmDialogOpen, setConfirmDialogText),
  );
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

  function addConnection(connection: Connection) {
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

  function init() {
    addConnection(
      new Connection(
        "Extremely loooooooooooooooooooooooooooooooooong name",
        "test-webhook-id",
      ),
    );
    addConnection(new Connection("Test connection", "test-webhook-id"));
    addConnection(new Connection("Test connection", "test-webhook-id"));
    addConnection(new Connection("Test connection", "test-webhook-id"));
  }

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
    <>
      <motion.main layout animate={animate}>
        <div id="tab-content">
          <R_Tab active={activeNavTabId === NavTabId.Connections}>
            <R_Connections
              connections={connections}
              onConnectionAdd={addConnection}
              onConnectionDelete={deleteConnection}
              bakeToast={bakeToast}
              log={log}
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
          onTabSwitch={(newNavTabId: NavTabId) =>
            setActiveNavTabId(newNavTabId)
          }
        />
      </motion.main>
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

export default R_App;
