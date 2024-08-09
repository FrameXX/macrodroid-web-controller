import { AnimatePresence } from "framer-motion";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_Connection } from "../ConnectionCard/ConnectionCard";
import { R_FAB } from "../FAB/FAB";
import { R_CreateConnectionWizard } from "../CreateConnectionWizard/CreateConnectionWizard";
import { Connection } from "../../modules/connection";
import { BakeToast, Toast, ToastSeverity } from "../../modules/toaster";
import { LogRecordInitializer } from "../../modules/logger";
import { OutgoingRequest } from "../../modules/outgoing_request";
import { useImmer } from "use-immer";
import { R_MultiColList } from "../MultiColList/MultiColList";

interface ConnectionsProps {
  connections: Connection[];
  onConnectionConfirm: (connection: Connection) => void;
  onConnectionDelete: (connection: Connection) => void;
  bakeToast: BakeToast;
  log: (record: LogRecordInitializer) => void;
  handleIncomingInvalidRequest: (
    errorMessage: string,
    connection: Connection,
  ) => void;
  onClickCompanionMacro: () => void;
}

export function R_Connections(props: ConnectionsProps) {
  const [addConnectionWizardOpen, setAddConnectionWizardOpen] = useImmer(false);

  function openAddConnectionWizard() {
    setAddConnectionWizardOpen(true);
  }

  function closeAddConnectionWizard() {
    setAddConnectionWizardOpen(false);
  }

  async function pokeConnection(connection: Connection) {
    const request = OutgoingRequest.createPokeRequest();
    props.bakeToast(new Toast("Making poke request.", "message-arrow-right"));
    const requestLog = await connection.makeRequest(request);
    props.log(requestLog);

    if (requestLog.errorMessage) {
      props.bakeToast(
        new Toast(
          `Failed to poke connection. ${requestLog.errorMessage}`,
          "alert",
          ToastSeverity.Error,
        ),
      );
      return;
    } else {
      props.bakeToast(
        new Toast(
          "Activity evidence requested.",
          "transit-connection-variant",
          ToastSeverity.Success,
        ),
      );
    }
  }

  return (
    <>
      <R_IconNotice hidden={props.connections.length > 0}>
        No connections configured
      </R_IconNotice>
      <R_MultiColList
        items={props.connections}
        id="connections"
        minColWidthPx={400}
      >
        <AnimatePresence>
          {props.connections.map((connection) => (
            <R_Connection
              onPoke={() => {
                pokeConnection(connection);
              }}
              onDelete={() => {
                props.onConnectionDelete(connection);
              }}
              key={connection.id}
              name={connection.name}
              id={connection.id}
              lastActivityTimestamp={connection.lastActivityTimestamp}
              listenerHealthy={connection.listenerHealthy}
            />
          ))}
        </AnimatePresence>
      </R_MultiColList>
      <R_FAB
        title="Create new connection"
        onClick={openAddConnectionWizard}
        iconId="plus"
      />
      <R_CreateConnectionWizard
        onClickCompanionMacro={props.onClickCompanionMacro}
        log={props.log}
        onConnectionConfirm={(connection) => {
          props.onConnectionConfirm(connection);
          closeAddConnectionWizard();
        }}
        bakeToast={props.bakeToast}
        onCancel={closeAddConnectionWizard}
        open={addConnectionWizardOpen}
        handleIncomingInvalidRequest={props.handleIncomingInvalidRequest}
      />
    </>
  );
}
