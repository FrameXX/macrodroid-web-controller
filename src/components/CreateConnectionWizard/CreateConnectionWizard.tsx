import R_FAB from "../FAB/FAB";
import R_TitleWithIcon from "../TitleWithIcon/TitleWithIcon";
import { useState } from "react";
import R_DescribedInput from "../DescribedInput/DescribedInput";
import screenshot1Src from "../../assets/img/screenshot_1.webp";
import R_Wizard from "../Wizard/Wizard";
import { MACRODROID_APP_URL } from "../../modules/const";
import { Toast, ToastSeverity } from "../../modules/toaster";
import { Connection } from "../../modules/connection";
import { IncomingRequest } from "../../modules/incoming_request";
import { LogRecordInitializer } from "../LogRecord/LogRecord";

interface AddConnectionWizardProps {
  open: boolean;
  bakeToast: (toast: Toast) => any;
  onClose: () => any;
  onConnectionAdd: (connection: Connection) => any;
  log: (record: LogRecordInitializer) => any;
}

export default function R_CreateConnectionWizard({
  bakeToast,
  log,
  ...props
}: AddConnectionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [connectionNameValid, setConnectionNameValid] = useState(false);
  const [webhookIdValid, setWebhookIdValid] = useState(false);
  const [connectionAddRequestId, setConnectionAddRequestId] = useState("");
  const [connectionName, setConnectionName] = useState<string>("");
  const [webhookId, setWebhookId] = useState<string>("");
  const [lastConnection, setLastConnection] = useState<Connection>();

  function nextPage() {
    if (activePageIndex === 1) initNewConnection();
    setActivePageIndex(activePageIndex + 1);
  }

  function previousPage() {
    if (activePageIndex === 2) cancelNewConnection();
    setActivePageIndex(activePageIndex - 1);
  }

  function resetInputs() {
    setConnectionName("");
    setWebhookId("");
  }

  function addConnection(connection: Connection) {
    props.onConnectionAdd(connection);
    bakeToast(
      new Toast(
        "Connection was confirmed and added successfully.",
        "transit-connection-variant",
      ),
    );
    resetInputs();
  }

  function cancelNewConnection() {
    if (!lastConnection) return;
    if (lastConnection?.listening) lastConnection.stopListeningRequests();
    bakeToast(new Toast("Connection initialization canceled.", "cancel"));
  }

  async function initNewConnection() {
    const connection = new Connection(connectionName, webhookId);
    setLastConnection(connection);
    const request = await connection.requestAddConnection((id) => {
      setConnectionAddRequestId(id);
    });

    const requestLog: LogRecordInitializer = {
      connectionName: connection.name,
      response: false,
      detail: request.detail,
      id: request.id,
      incoming: false,
    };
    if (!request.successful) {
      bakeToast(
        new Toast(
          `Failed to requst connection confirmation. ${request.errorMessage}`,
          "alert",
          ToastSeverity.ERROR,
        ),
      );
      log({
        ...requestLog,
        errorMessage: request.errorMessage,
      });
      return;
    }

    bakeToast(
      new Toast(
        "Connection confirmation requested. Waiting for response.",
        "transit-connection-variant",
      ),
    );
    log(requestLog);

    connection.listenRequests(
      (request) => handleIncomingRequest(request, connection),
      (errorMessage) => {
        handleIncomingFailedRequest(errorMessage, connection);
      },
    );
  }

  function handleIncomingFailedRequest(
    errorMessage: string,
    connection: Connection,
  ) {
    log({
      connectionName: connection.name,
      errorMessage,
      response: true,
      incoming: true,
    });
  }

  function handleIncomingRequest(
    request: IncomingRequest,
    connection: Connection,
  ) {
    if (request.id !== connectionAddRequestId) {
      const errorMessage =
        "The connection was confirmed but with a different request ID.";
      bakeToast(new Toast(errorMessage, "alert", ToastSeverity.ERROR));
      log({
        connectionName: connection.name,
        id: request.id,
        response: false,
        incoming: true,
        errorMessage,
      });
      return;
    }
    addConnection(connection);
  }

  return (
    <R_Wizard
      open={props.open}
      activePageIndex={activePageIndex}
      leftButton={
        <>
          <R_FAB
            hidden={activePageIndex !== 0}
            left
            title="Cancel creation of new connection"
            onClick={props.onClose}
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
          hidden={
            (activePageIndex === 1 &&
              (!connectionNameValid || !webhookIdValid)) ||
            activePageIndex == 2
          }
          title="Next page"
          iconId="chevron-right"
          onClick={nextPage}
        />
      }
      pages={[
        <>
          <h2>Meet the prerequisites</h2>
          <R_TitleWithIcon iconId="wifi-check">
            <h3>Your target device is connected to internet</h3>
          </R_TitleWithIcon>
          <R_TitleWithIcon iconId="package-down">
            <h3>
              You have{" "}
              <a href={MACRODROID_APP_URL} target="_blank">
                MacroDroid
              </a>{" "}
              installed and running on your target device
            </h3>
          </R_TitleWithIcon>
          <R_TitleWithIcon iconId="import">
            <h3>You have the companion macro imported into MacroDroid</h3>
          </R_TitleWithIcon>
        </>,
        <>
          <h2>Enter info</h2>
          <form id="connection-info">
            <R_DescribedInput
              onChange={(event) => {
                setConnectionName(event.target.value);
                setConnectionNameValid(event.target.validity.valid);
              }}
              required
              type="text"
              maxLength={40}
              placeholder="Enter connection name"
              description="This is your custom name, so that you can differentiate the connection from other."
            />
            <R_DescribedInput
              onChange={(event) => {
                setWebhookId(event.target.value);
                setWebhookIdValid(event.target.validity.valid);
              }}
              required
              pattern="(?:[a-z]|\d|-){25,50}"
              type="text"
              autoCapitalize="none"
              placeholder="Enter webhook ID"
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
          </form>
        </>,
        <>
          <h2>Confirm the connection</h2>
          <p>The request ID is:</p>
          <strong>{connectionAddRequestId}</strong>
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
