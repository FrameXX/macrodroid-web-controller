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
import {
  IncomingRequest,
  IncomingRequestType,
} from "./modules/incoming_request";
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
import { ConfirmDialog } from "./modules/confirm_dialog";
import { R_Connections } from "./components/Connections/Connections";
import { useLocalStorage } from "./modules/use_local_storage";
import { R_Actions } from "./components/Actions/Actions";
import { enums } from "superstruct";
import { R_WelcomeWizard } from "./components/WelcomeWizard/WelcomeWizard";
import { R_Extras } from "./components/Extras/Extras";
import {
  CLIPBOARD_FILL_REQUEST_COMMENT,
  NOTIFICATION_REQUEST_COMMENT,
  UKNOWN_REQUEST_COMMENT,
} from "./modules/const";
import { R_OfflineIndicator } from "./components/OfflineIndicator/OfflineIndicator";

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
  const [companionMacroWizardOpen, setCompanionMacroWizardOpen] =
    useImmer(false);

  const toaster = useRef(new Toaster(setToasts));
  const logger = useRef(new Logger(setLogRecords));
  const confirmDialog = useRef(
    new ConfirmDialog(setConfirmDialogOpen, setConfirmDialogText),
  );
  const logScrollableContainer = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isCompanionURLArgPresent()) redirectToCompanionMacroWizard();
    addLogScrollableContainerListener();
  }, []);

  useEffect(() => {
    addListenerToAllConnections();
    return () => {
      removeListenerOfAllConnections();
    };
  }, [connections, logRecords]);

  function addListenerToAllConnections() {
    connections.forEach((connection, index) => {
      connection.listenRequests(
        (request) => {
          handleIncomingRequest(request, index);
        },
        (errorMessage) => {
          handleIncomingFailedRequest(errorMessage, connection);
        },
        () => handleListenFailed(index),
        () => handleListenSucceeded(index),
      );
    });
  }

  function removeListenerOfAllConnections() {
    connections.forEach((connection) => {
      connection.removeRequestListeners();
    });
  }

  function isCompanionURLArgPresent() {
    const urlParams = new URLSearchParams(window.location.search);
    const companionArg = urlParams.get("companion");
    return companionArg !== null;
  }

  function addLogScrollableContainerListener() {
    if (!logScrollableContainer.current) {
      console.warn("Logs scrollable container not found.");
      return;
    }
    const container = logScrollableContainer.current;

    function onScroll() {
      setLogScrolledDown(container.scrollTop > innerHeight * 0.5);
    }

    container.addEventListener("scroll", onScroll);
  }

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
    if (!connection.receiverOpened) connection.openReceiver();
  }

  function updateConnectionLastActivity(connectionIndex: number) {
    setConnections((draft) => {
      draft[connectionIndex].lastActivityTimestamp = Date.now();
      return draft;
    });
    saveConnections();
  }

  function commentIncomingRequest(request: IncomingRequest) {
    if (request.type === IncomingRequestType.Notification) {
      return NOTIFICATION_REQUEST_COMMENT;
    }
    if (request.type === IncomingRequestType.ClipboardFill) {
      return CLIPBOARD_FILL_REQUEST_COMMENT;
    }

    const matchingOutgoingLogRecords = logRecords.filter(
      (logRecord) =>
        logRecord.type === LogRecordType.OutgoingRequest &&
        logRecord.requestId === request.id,
    );

    if (matchingOutgoingLogRecords.length === 0) return UKNOWN_REQUEST_COMMENT;
    if (!matchingOutgoingLogRecords[0].comment) {
      return UKNOWN_REQUEST_COMMENT;
    } else {
      const matchingComment = matchingOutgoingLogRecords[0].comment;
      return matchingComment;
    }
  }

  function isTabActive(tabId: NavTabId) {
    return activeNavTabId === tabId;
  }

  function toastifyIncomingRequest(
    request: IncomingRequest,
    comment: string,
    connectionName: string,
  ) {
    let message: string;
    if (request.type === IncomingRequestType.Notification) {
      message = `New notification from ${connectionName}.`;
    } else if (request.type === IncomingRequestType.ClipboardFill) {
      message = `${connectionName} filled the clipboard.`;
    } else {
      message = `${connectionName} responded to ${comment}.`;
    }
    bakeToast(new Toast(message, "info", ToastSeverity.Info));
  }

  function notifyIncomingRequest(
    request: IncomingRequest,
    comment: string,
    connectionName: string,
  ) {
    if (Notification.permission !== "granted")
      throw new Error("Notification permission is not granted.");

    let notificationTitle: string;
    let notificationBody: string | undefined;
    if (request.type === IncomingRequestType.Notification) {
      notificationTitle = request.details[0];
      if (request.details.length > 1)
        notificationBody = request.details.slice(1).join("\n\n");
    } else if (request.type === IncomingRequestType.ClipboardFill) {
      notificationTitle = `${connectionName} filled the clipboard.`;
      notificationBody = request.details[0];
    } else {
      notificationTitle = `${connectionName} responded to ${comment}`;
      notificationBody = request.details.join("\n\n");
    }

    const notification = new Notification(notificationTitle, {
      body: notificationBody,
    });
    notification.addEventListener("click", () => {
      window.focus();
      setActiveNavTabId(NavTabId.Log);
    });
  }

  function handleIncomingRequest(
    request: IncomingRequest,
    connectionIndex: number,
  ) {
    updateConnectionLastActivity(connectionIndex);
    const connection = connections[connectionIndex];
    const comment = commentIncomingRequest(request);
    const record = {
      comment,
      connectionName: connection.name,
      requestId: request.id,
      response: true,
      type: LogRecordType.IncomingRequest,
      details: request.details,
    };
    log(record);

    if (isTabActive(NavTabId.Log)) return;

    if (Notification.permission === "granted") {
      notifyIncomingRequest(request, comment, connection.name);
    } else {
      toastifyIncomingRequest(request, comment, connection.name);
    }
  }

  function handleIncomingFailedRequest(
    errorMessage: string,
    connection: Connection,
  ) {
    bakeToast(
      new Toast(
        `An incoming request with invalid strcuture was received. ${errorMessage}`,
        "alert",
        ToastSeverity.Error,
      ),
    );
    log({
      connectionName: connection.name,
      response: false,
      type: LogRecordType.IncomingRequest,
      errorMessage,
    });
  }

  function reportConnectionListenerHealthiness(
    connectionIndex: number,
    healthy: boolean,
  ) {
    setConnections((draft) => {
      draft[connectionIndex].listenerHealthy = healthy;
      return draft;
    });
  }

  function handleListenFailed(connectionIndex: number) {
    reportConnectionListenerHealthiness(connectionIndex, false);
    const connection = connections[connectionIndex];
    const errorMessage = `Connection ${connection.name} listener was suspended or failed.`;
    bakeToast(new Toast(errorMessage, "alert", ToastSeverity.Error));
  }

  function handleListenSucceeded(connectionIndex: number) {
    const connection = connections[connectionIndex];
    if (!connection.listenerHealthy) {
      bakeToast(
        new Toast(
          `Connection ${connection.name} was reconnected.`,
          "info",
          ToastSeverity.Success,
        ),
      );
    }
    reportConnectionListenerHealthiness(connectionIndex, true);
  }

  async function deleteConnection(connection: Connection) {
    if (
      !(await confirm(
        `Are you sure you want to delete connection ${connection.name}? You will have to create it again if you want to use it.`,
      ))
    )
      return;
    if (connection.isListening) connection.removeRequestListeners();
    if (connection.receiverOpened) connection.closeReceiver();
    setConnections(
      connections.filter(
        (currentConnection) => currentConnection.id !== connection.id,
      ),
    );
  }

  function redirectToCompanionMacroWizard() {
    setActiveNavTabId(NavTabId.Extras);
    setCompanionMacroWizardOpen(true);
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
          <R_Tab active={isTabActive(NavTabId.Connections)}>
            <R_Connections
              onClickCompanionMacro={redirectToCompanionMacroWizard}
              connections={connections}
              onConnectionConfirm={addConnection}
              onConnectionDelete={deleteConnection}
              bakeToast={bakeToast}
              log={log}
              handleIncomingFailedRequest={handleIncomingFailedRequest}
            />
          </R_Tab>
          <R_Tab active={isTabActive(NavTabId.Actions)}>
            <R_Actions
              onRecoverError={onRecoverError}
              connections={connections}
              log={log}
              bakeToast={bakeToast}
              confirm={confirm}
            />
          </R_Tab>
          <R_Tab
            ref={logScrollableContainer}
            active={isTabActive(NavTabId.Log)}
          >
            <R_Log
              scrolledDown={logScrolledDown}
              onScrollUp={scrollLogTop}
              logRecords={logRecords}
              clearLog={logger.current.clear}
              confirm={confirm}
            />
          </R_Tab>
          <R_Tab active={isTabActive(NavTabId.Extras)}>
            <R_Extras
              bakeToast={bakeToast}
              companionMacroWizardOpen={companionMacroWizardOpen}
              onCloseCompanionMacroWizard={() =>
                setCompanionMacroWizardOpen(false)
              }
              onClickOpenCompanionMacroWizard={() =>
                setCompanionMacroWizardOpen(true)
              }
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
      <R_WelcomeWizard bakeToast={bakeToast} />
      <R_ConfirmDialog
        open={confirmDialogOpen}
        onConfirm={() => confirmDialog.current.resolve(true)}
        onCancel={() => confirmDialog.current.resolve(false)}
        text={confirmDialogText}
      />
      <R_OfflineIndicator />
      <R_Toaster
        onToastClick={(id) => toaster.current.removeToastById(id)}
        toasts={toasts}
      />
    </>
  );
}
