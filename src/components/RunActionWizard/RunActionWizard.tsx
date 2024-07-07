import { useImmer } from "use-immer";
import { R_Wizard } from "../Wizard/Wizard";
import { R_FAB } from "../FAB/FAB";
import { Action } from "../../modules/action";
import { Connection } from "../../modules/connection";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { useColumnDeterminator } from "../../modules/use_column_determinator";
import { R_ActionArgInputList } from "../ActionArgInputList/ActionArgInputList";
import { useForceUpdate } from "../../modules/use_force_update";

interface RunActionWizardProps {
  open: boolean;
  runAction: Action | null;
  onCancel: () => void;
  onActionRunConfirm: (action: Action, connections: Connection[]) => void;
  connections: Connection[];
}

export function R_RunActionWizard(props: RunActionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [selectedConnections, setSelectedConnections] = useImmer<Connection[]>(
    [],
  );
  const runAction = useRef<Action | null>(null);
  const connectionsContainer = useRef(null);

  const connectionsColumns = useColumnDeterminator(
    connectionsContainer,
    props.connections,
    400,
  );

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    runAction.current = structuredClone(props.runAction);
    forceUpdate();
  }, [props.runAction]);

  function toggleConnection(connection: Connection, value: boolean) {
    if (value) {
      setSelectedConnections((selectedConnections) => {
        selectedConnections.push(connection);
        return selectedConnections;
      });
    } else {
      setSelectedConnections((selectedConnections) => {
        selectedConnections.splice(selectedConnections.indexOf(connection), 1);
        return selectedConnections;
      });
    }
  }

  return (
    <R_Wizard
      activePageIndex={activePageIndex}
      open={props.open}
      pages={[
        <>
          <h2>Optionally alter arguments</h2>
          <R_ActionArgInputList
            configuredAction={runAction.current}
            onArgChange={(index, newValue) =>
              (runAction.current!.args[index].value = newValue)
            }
          />
        </>,
        <>
          <h2>Select connections to run the action</h2>
          <motion.div
            animate={{ columns: connectionsColumns }}
            ref={connectionsContainer}
          >
            {props.connections.map((connection) => (
              <R_BooleanOption
                key={connection.id}
                title={connection.name}
                onChange={(newValue) => toggleConnection(connection, newValue)}
              />
            ))}
          </motion.div>
        </>,
      ]}
      leftButton={
        <>
          <R_FAB
            hidden={activePageIndex !== 0}
            left
            title="Cancel"
            onClick={props.onCancel}
            iconId="close"
          />
          <R_FAB
            hidden={activePageIndex === 0}
            left
            title="Previous page"
            onClick={() => setActivePageIndex(0)}
            iconId="chevron-left"
          />
        </>
      }
      rightButton={
        <>
          <R_FAB
            hidden={activePageIndex !== 0}
            title="Next page"
            iconId="chevron-right"
            onClick={() => setActivePageIndex(1)}
          />
          <R_FAB
            hidden={activePageIndex !== 1 || !selectedConnections.length}
            title="Run action"
            iconId="play"
            onClick={() => props.onActionRunConfirm(runAction.current!, [])}
          />
        </>
      }
    />
  );
}
