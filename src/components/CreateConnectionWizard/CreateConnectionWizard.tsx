import { R_FAB } from "../FAB/FAB";
import { R_StringOption } from "../StringOption/StringOption";
import screenshot1Src from "../../assets/img/screenshot_1.webp";
import { R_Wizard } from "../Wizard/Wizard";
import {
  CONFIRM_CONNECTION_REQUEST_COMMENT,
  MACRODROID_APP_URL,
} from "../../modules/const";
import { BakeToast, Toast, ToastSeverity } from "../../modules/toaster";
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
  onCancel: () => void;
  onConnectionConfirm: (connection: Connection) => void;
  log: Log;
  handleIncomingInvalidRequest: (
    errorMessage: string,
    connection: Connection,
  ) => void;
  onClickCompanionMacro: () => void;
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
  }

  function onSuccess(connection: Connection) {
    connection.lastActivityTimestamp = Date.now();
    connection.removeRequestListeners();
    props.onConnectionConfirm(connection);
    props.bakeToast(
      new Toast(
        "Connection was confirmed and added.",
        "transit-connection-variant",
        ToastSeverity.Success,
      ),
    );
    reset();
  }

  function cancelNewConnection() {
    if (!lastConnection) return;
    lastConnection.closeReceiver();
    lastConnection.removeRequestListeners();
    props.bakeToast(new Toast("Connection initialization canceled.", "cancel"));
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
    props.bakeToast(
      new Toast(
        "Making connection confirmation request.",
        "message-arrow-right",
      ),
    );
    const requestLog = await connection.makeRequest(request);
    props.log(requestLog);

    if (requestLog.errorMessage) {
      props.bakeToast(
        new Toast(
          `Failed to request connection creation confirmation. ${requestLog.errorMessage}`,
          "alert",
          ToastSeverity.Error,
        ),
      );
    } else {
      props.bakeToast(
        new Toast(
          "Connection creation confirmation requested. Waiting for response.",
          "transit-connection-variant",
          ToastSeverity.Success,
        ),
      );
    }

    connection.openReceiver();
    connection.listenRequests(
      (request) => handleIncomingRequest(request, connection, request.id),
      (errorMessage) => {
        props.handleIncomingInvalidRequest(errorMessage, connection);
      },
      handleListenFailed,
    );
  }

  function handleListenFailed() {
    props.bakeToast(
      new Toast(
        "Failed to listen for incoming requests.",
        "alert",
        ToastSeverity.Error,
      ),
    );
  }

  function handleInvalidConfirmationRequest(
    errorMessage: string,
    connectionName: string,
    requestId: string,
  ) {
    props.bakeToast(new Toast(errorMessage, "alert", ToastSeverity.Error));
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
      comment: CONFIRM_CONNECTION_REQUEST_COMMENT,
      connectionName: connection.name,
      requestId: request.id,
      isResponse: true,
      type: LogRecordType.IncomingRequest,
    });
    onSuccess(connection);
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
          <R_InfoCard id="webhook-id-disclosure-info">
            The provided webhook ID is not ever send as a part of any request
            and stays only on this device.
          </R_InfoCard>
          <R_StringOption
            iconId="webhook"
            ref={webhookIdInput}
            onChange={(newValue, validity) => {
              setWebhookId(newValue);
              setWebhookIdValid(validity);
            }}
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
                  Enter just the ID (between last 2 forward slashes).
                </div>
                <img src={screenshot1Src} />
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
