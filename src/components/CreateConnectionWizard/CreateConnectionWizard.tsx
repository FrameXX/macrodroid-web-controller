import { R_FAB } from "../FAB/FAB";
import { R_StringOption } from "../StringOption/StringOption";
import screenshot1Path from "../../assets/img/screenshot_1.webp?url";
import { R_Wizard } from "../Wizard/Wizard";
import {
  CONFIRM_CONNECTION_REQUEST_COMMENT,
  MACRODROID_APP_URL,
} from "../../modules/const";
import { BakeToast, ToastSeverity } from "../../modules/toaster";
import { Connection } from "../../modules/connection";
import {
  IncomingRequest,
  IncomingRequestType,
} from "../../modules/incoming_request";
import { useImmer } from "use-immer";
import { OutgoingRequest } from "../../modules/outgoing_request";
import { Log, LogRecordType } from "../../modules/logger";
import "./CreateConnectionWizard.scss";
import { useRef } from "react";
import { R_SimpleCard } from "../SimpleCard/SimpleCard";
import { useKey } from "../../modules/use_key";
import { R_InfoCard } from "../InfoCard/InfoCard";

interface AddConnectionWizardProps {
  open: boolean;
  bakeToast: BakeToast;
  onCancel: () => unknown;
  onConnectionConfirm: (connection: Connection) => unknown;
  log: Log;
  handleIncomingInvalidRequest: (
    errorMessage: string,
    connection: Connection,
  ) => unknown;
  onClickCompanionMacro: () => unknown;
}

export function R_CreateConnectionWizard(props: AddConnectionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [connectionNameValid, setConnectionNameValid] = useImmer(false);
  const [webhookIdValid, setWebhookIdValid] = useImmer(false);
  const [connectionAddRequestId, setConnectionAddRequestId] = useImmer("");
  const [connectionName, setConnectionName] = useImmer("");
  const [webhookId, setWebhookId] = useImmer("");
  const [lastConnection, setLastConnection] = useImmer<Connection | null>(null);

  const connectionNameInput = useRef<HTMLInputElement>(null);
  const webhookIdInput = useRef<HTMLInputElement>(null);

  useKey("Escape", () => {
    if (activePageIndex === 0) {
      props.onCancel();
    } else {
      previousPage();
    }
  });

  function nextPage() {
    if (activePageIndex === 1) initNewConnection();
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex + 1);
  }

  function previousPage() {
    if (activePageIndex === 2) cancelNewConnection();
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex - 1);
  }

  function reset() {
    setConnectionName("");
    setWebhookId("");
    setActivePageIndex(0);
    setWebhookIdValid(false);
    setConnectionNameValid(false);
  }

  function onSuccess(connection: Connection) {
    connection.lastActivityTimestamp = Date.now();
    connection.incomingServer.removeRequestListener();
    props.onConnectionConfirm(connection);
    props.bakeToast({
      message: "Connection was confirmed and added.",
      iconId: "transit-connection-variant",
      severity: ToastSeverity.Success,
    });
    reset();
  }

  function cancelNewConnection() {
    if (!lastConnection) return;
    lastConnection.incomingServer.closeConnection();
    lastConnection.incomingServer.removeRequestListener();
    props.bakeToast({
      message: "Connection initialization canceled.",
      iconId: "cancel",
    });
  }

  function cantNextPage() {
    return (
      (activePageIndex === 1 && (!connectionNameValid || !webhookIdValid)) ||
      activePageIndex === 2
    );
  }

  async function initNewConnection() {
    const connection = new Connection(connectionName, webhookId);
    setLastConnection(connection);

    const request = OutgoingRequest.createAddConnectionRequest();
    setConnectionAddRequestId(request.id);
    props.bakeToast({
      message: "Making connection confirmation request.",
      iconId: "message-arrow-right",
    });
    const requestLog = await connection.makeRequest(request);
    props.log(requestLog);

    if (requestLog.errorMessage) {
      props.bakeToast({
        message: `Failed to request connection creation confirmation. ${requestLog.errorMessage}`,
        iconId: "alert",
        severity: ToastSeverity.Error,
      });
    } else {
      props.bakeToast({
        message:
          "Connection creation confirmation requested. Waiting for response.",
        iconId: "transit-connection-variant",
        severity: ToastSeverity.Success,
      });
    }

    connection.incomingServer.listenRequests(
      (request) => handleIncomingRequest(request, connection, request.id),
      (errorMessage) => {
        props.handleIncomingInvalidRequest(errorMessage, connection);
      },
      handleListenFailed,
    );
  }

  function handleListenFailed() {
    props.bakeToast({
      message: "Failed to listen for incoming requests.",
      iconId: "alert",
      severity: ToastSeverity.Error,
    });
  }

  function handleInvalidConfirmationRequest(
    errorMessage: string,
    connectionName: string,
    requestId: string,
  ) {
    props.bakeToast({
      message: errorMessage,
      iconId: "alert",
      severity: ToastSeverity.Error,
    });
    props.log({
      comment: "Invalid request",
      connectionName: connectionName,
      requestId: requestId,
      isResponse: false,
      type: LogRecordType.IncomingRequest,
      errorMessage,
    });
  }

  function handleIncomingRequest(
    request: IncomingRequest,
    connection: Connection,
    outgoingRequestId: string,
  ) {
    if (request.id !== outgoingRequestId) {
      handleInvalidConfirmationRequest(
        "The connection was confirmed with a unexpected request ID.",
        connection.name,
        request.id,
      );
      return;
    }
    if (request.type !== IncomingRequestType.Confirmation) {
      handleInvalidConfirmationRequest(
        "The connection was confirmed with an unexpected request type.",
        connection.name,
        request.id,
      );
      return;
    }
    props.log({
      comment: `Confirm: ${CONFIRM_CONNECTION_REQUEST_COMMENT}`,
      connectionName: connection.name,
      requestId: request.id,
      isResponse: true,
      type: LogRecordType.IncomingRequest,
    });
    onSuccess(connection);
  }

  function handleWebhookIdChange(newValue: string, validity: boolean) {
    setWebhookId(newValue);
    setWebhookIdValid(validity);
    const webhookURLPattern = new RegExp(".*trigger.macrodroid.com/(.*?)/.*");
    const match = newValue.match(webhookURLPattern);
    if (!match) return;
    if (!match.length) return;
    const extractedWebhookId = match[1];
    setWebhookId(extractedWebhookId);
    props.bakeToast({
      message:
        "Webhook URL detected. The webhook ID was automatically extracted.",
      iconId: "text-box-search",
    });
  }

  return (
    <R_Wizard
      id="wizard-create-connection"
      open={props.open}
      activePageIndex={activePageIndex}
      leftButton={
        <>
          <R_FAB
            hidden={activePageIndex !== 0}
            left
            title="Cancel creation of new connection"
            onClick={props.onCancel}
            iconId="close"
          />
          <R_FAB
            hidden={activePageIndex === 0}
            left
            title="Previous page"
            onClick={previousPage}
            iconId="chevron-left"
          />
        </>
      }
      rightButton={
        <R_FAB
          hidden={cantNextPage()}
          title="Next page"
          iconId="chevron-right"
          onClick={() => {
            nextPage();
          }}
        />
      }
      pages={[
        <>
          <h2>Meet the prerequisites</h2>
          <R_SimpleCard className="prerequisite" iconId="wifi-check">
            <h3>Your target device is connected to internet</h3>
          </R_SimpleCard>
          <R_SimpleCard className="prerequisite" iconId="package-down">
            <h3>
              You have{" "}
              <a href={MACRODROID_APP_URL} target="_blank">
                MacroDroid
              </a>{" "}
              installed and running on your target device
            </h3>
          </R_SimpleCard>
          <R_SimpleCard className="prerequisite" iconId="import">
            <h3>
              You have the{" "}
              <a
                title="Download companion macro"
                onClick={props.onClickCompanionMacro}
              >
                companion macro
              </a>{" "}
              imported into MacroDroid
            </h3>
          </R_SimpleCard>
          <R_InfoCard id="companion-safety-notice">
            The companion macro will ignore all action requests triggering the
            webhook that do not contain a connection ID that was generated and
            send over secure connection during this connection creation process
            after approval on both sides of the connection.
          </R_InfoCard>
        </>,
        <>
          <h2>Enter info</h2>
          <R_StringOption
            iconId="rename"
            ref={connectionNameInput}
            onChange={(newValue, validity) => {
              setConnectionName(newValue);
              setConnectionNameValid(validity);
            }}
            onKeyUp={(event) => {
              if (event.key === "Enter") webhookIdInput.current?.focus();
            }}
            value={connectionName}
            required
            type="text"
            maxLength={40}
            placeholder="Enter connection name"
            title="Connection name"
            description="This is your custom name, so that you can differentiate the connection from other."
          />
          <R_InfoCard id="webhook-id-disclosure-notice">
            The provided webhook ID is never send as a part of any request and
            stays only on this device.
          </R_InfoCard>
          <R_StringOption
            iconId="webhook"
            ref={webhookIdInput}
            onChange={handleWebhookIdChange}
            onKeyUp={(event) => {
              if (event.key === "Enter" && !cantNextPage()) nextPage();
            }}
            value={webhookId}
            required
            pattern="(?:[a-z]|\d|-){25,50}"
            type="text"
            autoCapitalize="none"
            placeholder="Enter webhook ID"
            title="Webhook ID"
            description={
              <>
                <div>
                  You can find webhook URL of your connection by going to New
                  macro &gt; Add trigger &gt; Connectivity &gt; Webhook (Url).
                  Enter just the ID (between last 2 forward slashes) or paste
                  the whole URL and the ID will be automatically extracted.
                </div>
                <img alt="screenshot" src={screenshot1Path} />
              </>
            }
          />
        </>,
        <>
          <h2>Confirm the connection</h2>
          <p>The request ID is:</p>
          <strong id="connection-add-request-id">
            {connectionAddRequestId}
          </strong>
          <p>
            Wait before the confirmation is successfully requested (You will be
            informed) and confirm the request on your target device.
          </p>
          <p>
            In other case there might be a problem with your webhook ID, your
            device's internet connection or MacroDroid webhook server. You can
            go back to edit the webhook ID.
          </p>
        </>,
      ]}
    />
  );
}
