import { AnimatePresence } from "framer-motion";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_Connection } from "../ConnectionCard/ConnectionCard";
import { R_FAB } from "../FAB/FAB";
import { R_CreateConnectionWizard } from "../CreateConnectionWizard/CreateConnectionWizard";
import { Connection } from "../../modules/connection";
import { BakeToast, ToastSeverity } from "../../modules/toaster";
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
    props.bakeToast({
      message: "Making connection confirmation request.",
      iconId: "message-arrow-right",
    });
    const requestLog = await connection.makeRequest(request);
    props.log(requestLog);

    if (requestLog.errorMessage) {
      props.bakeToast({
        message: `Failed to request connection confirmation webhook. ${requestLog.errorMessage}`,
        iconId: "alert",
        severity: ToastSeverity.Error,
      });
      return;
    } else {
      props.bakeToast({
        message: "Connection confirmation webhook requested.",
        iconId: "webhook",
        severity: ToastSeverity.Success,
      });
    }
  }

  return (
    <>
      <R_IconNotice
        title="No connections configured"
        description="Create connection by clicking the + button in the bottom right corner."
        hidden={props.connections.length > 0}
      />
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
              incomingServerListenerIsHealthy={
                connection.incomingServer.listenerIsHealthy
              }
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
