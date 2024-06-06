import R_FAB from "../FAB/FAB";
import "./CreateConnectionWizard.scss";
import R_TitleWithIcon from "../TitleWithIcon/TitleWithIcon";
import { useState } from "react";
import R_DescribedInput from "../DescribedInput/DescribedInput";
import screenshot1Src from "../../assets/img/screenshot_1.webp";
import R_Wizard from "../Wizard/Wizard";
import { macrodroidAppUrl } from "../../modules/const";
import { Toast } from "../../modules/toaster";
import { Connection } from "../../modules/connection";

interface AddConnectionWizardProps {
  open: boolean;
  connectionAddRequestId: number;
  bakeToast: (toast: Toast) => any;
  onClose: () => any;
  onConnectionAdd: (connection: Connection) => any;
}

export default function R_CreateConnectionWizard(
  props: AddConnectionWizardProps,
) {
  // @ts-ignore
  const bakeToast = props.bakeToast;
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [connectionNameValid, setConnectionNameValid] = useState(false);
  const [webhookIdValid, setWebhookIdValid] = useState(false);
  const [connectionName, setConnectionName] = useState<string>("");
  const [webhookId, setWebhookId] = useState<string>("");

  function nextPage() {
    const previousPageIndex = activePageIndex;
    setActivePageIndex(activePageIndex + 1);
    if (previousPageIndex === 1) addConnection();
  }

  function addConnection() {
    const connection = new Connection(connectionName, webhookId);
    props.onConnectionAdd(connection);
  }

  function previousPage() {
    setActivePageIndex(activePageIndex - 1);
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
            <h3>Your target connection is connected to internet</h3>
          </R_TitleWithIcon>
          <R_TitleWithIcon iconId="package-down">
            <h3>
              You have{" "}
              <a href={macrodroidAppUrl} target="_blank">
                MacroDroid
              </a>{" "}
              installed and running on your target connection
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
          <div>The request ID is:</div>
          <strong>{props.connectionAddRequestId}</strong>
          <div id="connection-id"></div>
        </>,
      ]}
    />
  );
}
