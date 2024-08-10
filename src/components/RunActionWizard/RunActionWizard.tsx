import { useImmer } from "use-immer";
import { R_Wizard } from "../Wizard/Wizard";
import { R_FAB } from "../FAB/FAB";
import { Action, updateJSONString } from "../../modules/action";
import { Connection } from "../../modules/connection";
import { useEffect, useRef } from "react";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { R_ActionArgInputList } from "../ActionArgInputList/ActionArgInputList";
import { useForceUpdate } from "../../modules/use_force_update";
import { BakeToast, Toast, ToastSeverity } from "../../modules/toaster";
import { useKey } from "../../modules/use_key";
import { R_MultiColList } from "../MultiColList/MultiColList";

interface RunActionWizardProps {
  open: boolean;
  runAction: Action | null;
  onCancel: () => void;
  onConfirmRunAction: (
    action: Action,
    connections: Connection[],
    requireConfirmation: boolean,
  ) => void;
  bakeToast: BakeToast;
  connections: Connection[];
  skipArgs: boolean;
}

export function R_RunActionWizard(props: RunActionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [selectedConnections, setSelectedConnections] = useImmer<Connection[]>(
    [],
  );
  const [requireConfirmation, setRequireConfirmation] = useImmer(false);
  const runAction = useRef<Action | null>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (props.open && props.connections.length < 1) {
      props.bakeToast(
        new Toast(
          "Cannot run action if no connections are configured.",
          "alert",
          ToastSeverity.Error,
        ),
      );
      props.onCancel();
    }
  }, [props.open]);

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

  useKey("Escape", () => {
    if (activePageIndex === 0) {
      props.onCancel();
    } else {
      setActivePageIndex(0);
    }
  });

  function confirmRunAction() {
    if (!runAction.current) throw Error("Run action is not defined.");
    updateJSONString(runAction.current);
    props.onConfirmRunAction(
      runAction.current,
      selectedConnections,
      requireConfirmation,
    );
    reset();
  }

  function reset() {
    setSelectedConnections([]);
    setActivePageIndex(0);
    setRequireConfirmation(false);
  }

  function nextPage() {
    setActivePageIndex(activePageIndex + 1);
  }

  function previousPage() {
    setActivePageIndex(activePageIndex - 1);
  }

  const argsPage = (
    <>
      <h2>Optionally alter arguments</h2>
      <R_ActionArgInputList
        configuredAction={runAction.current}
        onArgChange={(index, newValue) =>
          (runAction.current!.args[index].value = newValue)
        }
      />
    </>
  );

  const connectionsPage = (
    <>
      <h2>Select connections to run the action</h2>
      <R_MultiColList items={props.connections} minColWidthPx={400}>
        {props.connections.map((connection) => (
          <R_BooleanOption
            key={connection.id}
            title={connection.name}
            onChange={(newValue) => toggleConnection(connection, newValue)}
            value={selectedConnections.includes(connection)}
          />
        ))}
      </R_MultiColList>
    </>
  );

  const confirmationPage = (
    <>
      <h2>Require confirmation?</h2>
      <R_BooleanOption
        title="Require confirmation"
        iconId="check-all"
        description="All connections will send a confirmation request immidiately after they receive the action request to ensure you that the action request was received."
        value={requireConfirmation}
        onChange={() => setRequireConfirmation(!requireConfirmation)}
      />
    </>
  );

  const pages = props.skipArgs
    ? [connectionsPage, confirmationPage]
    : [argsPage, connectionsPage, confirmationPage];

  return (
    <R_Wizard
      activePageIndex={activePageIndex}
      open={props.open}
      pages={pages}
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
            onClick={previousPage}
            iconId="chevron-left"
          />
        </>
      }
      rightButton={
        <>
          <R_FAB
            hidden={
              activePageIndex === pages.length - 1 ||
              (((activePageIndex === 0 && props.skipArgs) ||
                (activePageIndex === 1 && !props.skipArgs)) &&
                !selectedConnections.length)
            }
            title="Next page"
            iconId="chevron-right"
            onClick={nextPage}
          />
          <R_FAB
            hidden={activePageIndex !== pages.length - 1}
            title="Run action"
            iconId="play"
            onClick={confirmRunAction}
          />
        </>
      }
    />
  );
}
