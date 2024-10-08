import { useEffect, useRef } from "react";
import {
  Toast,
  ToastInitializer,
  ToastSeverity,
  Toaster,
} from "./modules/toaster";
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
  CONNECTIONS_STORAGE_KEY,
  CLIPBOARD_FILL_REQUEST_COMMENT as INCOMING_CLIPBOARD_FILL_REQUEST_COMMENT,
  NOTIFICATION_REQUEST_COMMENT as INCOMING_NOTIFICATION_REQUEST_COMMENT,
  LOG_RECORDS_STORAGE_KEY,
  UKNOWN_REQUEST_COMMENT,
} from "./modules/const";
import { R_OfflineIndicator } from "./components/OfflineIndicator/OfflineIndicator";
import { OutgoingRequest } from "./modules/outgoing_request";

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
  const connectionsRecovered = useRef(false);

  useEffect(() => {
    if (!navigator.cookieEnabled)
      bakeToast({
        message:
          "Cookies are disabled. No current changes will be restored in the next session. Some functionality may be crippled.",
        iconId: "cookie-remove",
        severity: ToastSeverity.Error,
      });
  }, []);

  useLocalStorage(logRecords, setLogRecords, {
    storageKey: LOG_RECORDS_STORAGE_KEY,
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
      storageKey: CONNECTIONS_STORAGE_KEY,
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
    () => {
      connectionsRecovered.current = true;
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
    if (isCompanionURLParamPresent()) redirectToCompanionMacroWizard();
    addLogScrollableContainerListener();
  }, []);

  useEffect(() => {
    addListenerAllConnections();
    return () => {
      removeListenerAllConnections();
    };
  }, [connections, logRecords]);

  function addListenerAllConnections() {
    connections.forEach((connection, index) => {
      if (connection.incomingServer.isListening) return;
      connection.incomingServer.listenRequests(
        (request) => {
          handleIncomingRequest(request, index);
        },
        (errorMessage) => {
          handleIncomingInvalidRequest(errorMessage, connection);
        },
        () => handleListenFailed(index),
        () => handleListenSucceeded(index),
      );
    });
  }

  function removeListenerAllConnections() {
    connections.forEach((connection) => {
      if (connection.incomingServer.isListening)
        connection.incomingServer.removeRequestListener();
    });
  }

  function isCompanionURLParamPresent() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("companion");
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
    bakeToast({
      message: text,
      iconId: "alert",
      severity: ToastSeverity.Error,
    });
    console.error(text);
  }

  function addConnection(connection: Connection) {
    setConnections((prevConnections) => {
      prevConnections.push(connection);
      return prevConnections;
    });
  }

  function updateConnectionLastActivity(connectionIndex: number) {
    setConnections((draft) => {
      draft[connectionIndex].lastActivityTimestamp = Date.now();
      return draft;
    });
    saveConnections();
  }

  function findIncomingRequestOutgoingComment(request: IncomingRequest) {
    const matchingOutgoingLogRecordIndex = logRecords.findIndex(
      (logRecord) =>
        logRecord.type === LogRecordType.OutgoingRequest &&
        logRecord.requestId === request.id,
    );

    if (matchingOutgoingLogRecordIndex === -1) {
      return undefined;
    }
    return logRecords[matchingOutgoingLogRecordIndex].comment;
  }

  function commentIncomingRequest(
    requestType: IncomingRequestType,
    outgoingComment: string,
  ) {
    switch (requestType) {
      case IncomingRequestType.Notification:
        return INCOMING_NOTIFICATION_REQUEST_COMMENT;
      case IncomingRequestType.TextShare:
        return INCOMING_CLIPBOARD_FILL_REQUEST_COMMENT;
      case IncomingRequestType.Confirmation:
        return `Confirm: ${outgoingComment}`;
      default:
        return outgoingComment;
    }
  }

  function isTabActive(tabId: NavTabId) {
    return activeNavTabId === tabId;
  }

  function toastifyIncomingRequest(
    request: IncomingRequest,
    outgoingComment: string,
    connectionName: string,
  ) {
    const message = request.createInfoMessage(connectionName, outgoingComment);
    bakeToast({ message, iconId: "transit-connection-variant" });
  }

  function notifyIncomingRequest(
    request: IncomingRequest,
    outgoingComment: string,
    connectionName: string,
  ) {
    if (Notification.permission !== "granted")
      throw new Error("Notification permission is not granted.");

    const notificationTitle = getNotificationTitle();
    const notificationBody = getNotificationBody();

    const notification = new Notification(notificationTitle, {
      body: notificationBody,
    });
    notification.addEventListener("click", handleNotificationClick);

    function handleNotificationClick() {
      window.focus();
      setActiveNavTabId(NavTabId.Log);
    }

    function getNotificationTitle() {
      return request.type === IncomingRequestType.Notification
        ? request.getNotificationTitle()
        : request.createInfoMessage(connectionName, outgoingComment);
    }

    function getNotificationBody() {
      switch (request.type) {
        case IncomingRequestType.Notification:
          return request.getNotificationBody();
        case IncomingRequestType.TextShare:
          return request.getSharedText();
        default:
          return request.details.join("\n\n");
      }
    }
  }

  function handleIncomingRequest(
    request: IncomingRequest,
    connectionIndex: number,
  ) {
    const connection = connections[connectionIndex];
    const outgoingComment =
      findIncomingRequestOutgoingComment(request) || UKNOWN_REQUEST_COMMENT;
    const comment = commentIncomingRequest(request.type, outgoingComment);
    const isResponse =
      request.type === IncomingRequestType.Confirmation ||
      request.type === IncomingRequestType.Response;
    const copyText =
      request.type === IncomingRequestType.TextShare
        ? request.getSharedText()
        : undefined;
    const logRecord: LogRecordInitializer = {
      comment,
      copyText,
      connectionName: connection.name,
      requestId: request.id,
      isResponse,
      type: LogRecordType.IncomingRequest,
      details: request.details,
    };
    log(logRecord);

    updateConnectionLastActivity(connectionIndex);
    handleTextShareConfirm();
    handleNotificationConfirm();

    if (isTabActive(NavTabId.Log)) return;

    if (
      Notification.permission === "granted" &&
      document.visibilityState === "hidden"
    ) {
      notifyIncomingRequest(request, outgoingComment, connection.name);
    } else {
      toastifyIncomingRequest(request, outgoingComment, connection.name);
    }

    async function handleTextShareConfirm() {
      if (request.type !== IncomingRequestType.TextShare) return;
      if (!request.getTextShareRequireConfirm()) return;
      const confirmRequest = OutgoingRequest.createConfirmRequest(
        request.id,
        INCOMING_CLIPBOARD_FILL_REQUEST_COMMENT,
      );
      const requestLog = await connection.makeRequest(confirmRequest);
      log(requestLog);

      if (requestLog.errorMessage) {
        bakeToast({
          message: `Failed to confirm text share request. ${requestLog.errorMessage}`,
          iconId: "alert",
          severity: ToastSeverity.Error,
        });
      }
    }

    async function handleNotificationConfirm() {
      if (request.type !== IncomingRequestType.Notification) return;
      if (!request.getNotificationRequireConfirm()) return;
      const confirmRequest = OutgoingRequest.createConfirmRequest(
        request.id,
        INCOMING_NOTIFICATION_REQUEST_COMMENT,
      );
      const requestLog = await connection.makeRequest(confirmRequest);
      log(requestLog);

      if (requestLog.errorMessage) {
        bakeToast({
          message: `Failed to confirm notification request. ${requestLog.errorMessage}`,
          iconId: "alert",
          severity: ToastSeverity.Error,
        });
      }
    }
  }

  function handleIncomingInvalidRequest(
    errorMessage: string,
    connection: Connection,
  ) {
    bakeToast({
      message: `An incoming request with an invalid structure was received. ${errorMessage}`,
      iconId: "alert",
      severity: ToastSeverity.Error,
    });
    log({
      comment: "Invalid request",
      connectionName: connection.name,
      isResponse: false,
      type: LogRecordType.IncomingRequest,
      errorMessage,
    });
  }

  function reportConnectionIncomingServerListenerHealthiness(
    connectionIndex: number,
    healthy: boolean,
  ) {
    setConnections((draft) => {
      draft[connectionIndex].incomingServer.listenerIsHealthy = healthy;
      return draft;
    });
  }

  function handleListenFailed(connectionIndex: number) {
    reportConnectionIncomingServerListenerHealthiness(connectionIndex, false);
    const connection = connections[connectionIndex];
    const errorMessage = `Connection ${connection.name} listener was suspended or failed.`;
    bakeToast({
      message: errorMessage,
      iconId: "alert",
      severity: ToastSeverity.Error,
    });
  }

  function handleListenSucceeded(connectionIndex: number) {
    const connection = connections[connectionIndex];
    if (!connection.incomingServer.listenerIsHealthy) {
      bakeToast({
        message: `Connection ${connection.name} listener was reestablished.`,
        iconId: "transit-connection-variant",
        severity: ToastSeverity.Success,
      });
    }
    reportConnectionIncomingServerListenerHealthiness(connectionIndex, true);
  }

  async function deleteConnection(connection: Connection) {
    if (
      !(await confirm(
        `Are you sure you want to delete connection ${connection.name}? You will have to create it again if you want to use it.`,
      ))
    )
      return;
    if (connection.incomingServer.isListening)
      connection.incomingServer.removeRequestListener();
    connection.incomingServer.closeConnection();
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

  function bakeToast(toastInitializer: ToastInitializer) {
    toaster.current.bake(toastInitializer);
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
              handleIncomingInvalidRequest={handleIncomingInvalidRequest}
            />
          </R_Tab>
          <R_Tab active={isTabActive(NavTabId.Actions)}>
            <R_Actions
              onDispatchActionFromURLParams={() =>
                setActiveNavTabId(NavTabId.Log)
              }
              onRecoverError={onRecoverError}
              connections={connections}
              connectionsRecovered={connectionsRecovered.current}
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
              bakeToast={bakeToast}
            />
          </R_Tab>
          <R_Tab active={isTabActive(NavTabId.Extras)}>
            <R_Extras
              confirm={confirm}
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
