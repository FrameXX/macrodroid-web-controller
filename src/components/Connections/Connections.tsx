import { AnimatePresence, Target, motion } from "framer-motion";
import R_IconNotice from "../IconNotice/IconNotice";
import R_Connection from "../ConnectionCard/ConnectionCard";
import R_FAB from "../FAB/FAB";
import R_CreateConnectionWizard from "../CreateConnectionWizard/CreateConnectionWizard";
import { Connection } from "../../modules/connection";
import { Toast, ToastSeverity } from "../../modules/toaster";
import { LogRecordInitializer } from "../../modules/logger";
import { OutgoingRequest } from "../../modules/outgoing_request";
import { useImmer } from "use-immer";
import { useRef } from "react";
import useResizeObserver from "../../modules/use_resize_observer";
import { useColumnDeterminator } from "../../modules/use_column_determinator";

interface ConnectionsProps {
  connections: Connection[];
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (connection: Connection) => void;
  bakeToast: (toast: Toast) => void;
  log: (record: LogRecordInitializer) => void;
}

export default function R_Connections(props: ConnectionsProps) {
  const [addConnectionWizardOpen, setAddConnectionWizardOpen] = useImmer(false);
  const connectionsContainer = useRef(null);

  async function pokeConnection(connection: Connection) {
    const request = OutgoingRequest.poke();
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

  const connectionsColumns = useColumnDeterminator(connectionsContainer, props.connections, 400);

  return (
    <>
      <R_IconNotice hidden={props.connections.length > 0}>
        No connections configured
      </R_IconNotice>
      <motion.div
        ref={connectionsContainer}
        animate={{columns: connectionsColumns}}
        id="connections"
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
              connection={connection}
              key={connection.id}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      <R_FAB
        title="Create new connection"
        onClick={() => setAddConnectionWizardOpen(true)}
        iconId="plus"
      />
      <R_CreateConnectionWizard
        log={props.log}
        onConnectionAdd={(connection) => {
          props.onConnectionAdd(connection);
          setAddConnectionWizardOpen(false);
        }}
        bakeToast={props.bakeToast}
        onClose={() => setAddConnectionWizardOpen(false)}
        open={addConnectionWizardOpen}
      />
    </>
  );
}
