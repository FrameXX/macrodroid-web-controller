import R_FAB from "../FAB/FAB";
import R_TitleWithIcon from "../TitleWithIcon/TitleWithIcon";
import R_DescribedInput from "../DescribedInput/DescribedInput";
import screenshot1Src from "../../assets/img/screenshot_1.webp";
import R_Wizard from "../Wizard/Wizard";
import { MACRODROID_APP_URL } from "../../modules/const";
import { Toast, ToastSeverity } from "../../modules/toaster";
import { Connection } from "../../modules/connection";
import { IncomingRequest } from "../../modules/incoming_request";
import { LogRecordInitializer, LogRecordType } from "../LogRecord/LogRecord";
import { useReactive } from "../../modules/reactive";

interface AddConnectionWizardProps {
  open: boolean;
  bakeToast: (toast: Toast) => void;
  onClose: () => void;
  onConnectionAdd: (connection: Connection) => void;
  log: (record: LogRecordInitializer) => void;
}

export default function R_CreateConnectionWizard({
  bakeToast,
  log,
  ...props
}: AddConnectionWizardProps) {
  const activePageIndex = useReactive(0);
  const connectionNameValid = useReactive(false);
  const webhookIdValid = useReactive(false);
  const connectionAddRequestId = useReactive("");
  const connectionName = useReactive("");
  const webhookId = useReactive("");
  const lastConnection = useReactive<Connection | null>(null);

  function nextPage() {
    if (activePageIndex.value === 1) initNewConnection();
    activePageIndex.value++;
  }

  function previousPage() {
    if (activePageIndex.value === 2) cancelNewConnection();
    activePageIndex.value--;
  }

  function reset() {
    connectionName.value = "";
    webhookId.value = "";
    activePageIndex.value = 0;
  }

  function addConnection(connection: Connection) {
    connection.stopListeningRequests();
    props.onConnectionAdd(connection);
    bakeToast(
      new Toast(
        "Connection was confirmed and added successfully.",
        "transit-connection-variant",
      ),
    );
    reset();
  }

  function cancelNewConnection() {
    if (!lastConnection) return;
    if (lastConnection.value?.listening)
      lastConnection.value.stopListeningRequests();
    bakeToast(new Toast("Connection initialization canceled.", "cancel"));
  }

  async function initNewConnection() {
    const connection = new Connection(connectionName.value, webhookId.value);
    lastConnection.value = connection;
    const request = await connection.requestAddConnection((requestId) => {
      connectionAddRequestId.value = requestId;
    });

    const requestLog: LogRecordInitializer = {
      connectionName: connection.name,
      response: false,
      comment: request.comment,
      requestId: request.id,
      type: LogRecordType.OutgoingRequest,
    };
    if (!request.successful) {
      bakeToast(
        new Toast(
          `Failed to requst connection confirmation. ${request.errorMessage}`,
          "alert",
          ToastSeverity.Error,
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
        ToastSeverity.Success,
      ),
    );
    log(requestLog);

    connection.listenRequests(
      (request) => handleIncomingRequest(request, connection),
      (errorMessage) => {
        handleIncomingFailedRequest(errorMessage, connection);
      },
      handleIncomingListenFailed,
    );
  }

  function handleIncomingListenFailed() {
    const errorMessage = "Failed to listen for incoming requests.";
    bakeToast(new Toast(errorMessage, "alert", ToastSeverity.Error));
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

  function handleIncomingRequest(
    request: IncomingRequest,
    connection: Connection,
  ) {
    if (request.id !== connectionAddRequestId.value) {
      const errorMessage =
        "The connection was confirmed but with a different request ID.";
      bakeToast(new Toast(errorMessage, "alert", ToastSeverity.Error));
      log({
        connectionName: connection.name,
        requestId: request.id,
        response: false,
        type: LogRecordType.IncomingRequest,
        errorMessage,
      });
      return;
    }
    log({
      connectionName: connection.name,
      requestId: request.id,
      response: true,
      type: LogRecordType.IncomingRequest,
    });
    addConnection(connection);
  }

  return (
    <R_Wizard
      open={props.open}
      activePageIndex={activePageIndex.value}
      leftButton={
        <>
          <R_FAB
            hidden={activePageIndex.value !== 0}
            left
            title="Cancel creation of new connection"
            onClick={props.onClose}
            iconId="close"
          />
          <R_FAB
            hidden={activePageIndex.value === 0}
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
            (activePageIndex.value === 1 &&
              (!connectionNameValid.value || !webhookIdValid.value)) ||
            activePageIndex.value == 2
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
                connectionName.value = event.target.value;
                connectionNameValid.value = event.target.validity.valid;
              }}
              required
              type="text"
              maxLength={40}
              placeholder="Enter connection name"
              description="This is your custom name, so that you can differentiate the connection from other."
            />
            <R_DescribedInput
              onChange={(event) => {
                webhookId.value = event.target.value;
                webhookIdValid.value = event.target.validity.valid;
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
          <strong>{connectionAddRequestId.value}</strong>
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
