import { useImmer } from "use-immer";
import { R_Wizard } from "../Wizard/Wizard";
import { R_FAB } from "../FAB/FAB";
import { Action, updateJSONString } from "../../modules/action";
import { Connection } from "../../modules/connection";
import { useEffect, useMemo, useRef } from "react";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { R_ActionArgInputList } from "../ActionArgInputList/ActionArgInputList";
import { useForceUpdate } from "../../modules/use_force_update";
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
  connections: Connection[];
  skipArgs: boolean;
  skipConfirmation: boolean;
}

export function R_RunActionWizard(props: RunActionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [selectedConnections, setSelectedConnections] = useImmer<Connection[]>(
    [],
  );
  const [requireConfirmation, setRequireConfirmation] = useImmer(false);
  const runAction = useRef<Action | null>(null);
  const forceUpdate = useForceUpdate();
  const skipArgs = useMemo(() => {
    return props.skipArgs || props.runAction?.args.length === 0;
  }, [props.skipArgs, props.runAction]);
  const skipConnections = useMemo(
    () => props.connections.length <= 1,
    [props.connections],
  );

  useEffect(() => {
    if (
      props.open &&
      skipArgs &&
      props.skipConfirmation &&
      props.connections.length === 1
    ) {
      throw new Error("There's nothing to configure about the action.");
    } else if (props.open && props.connections.length === 0) {
      throw new Error(
        "There are no configured connections to trigger actions on.",
      );
    }
  }, [props.open]);

  useEffect(() => {
    runAction.current = structuredClone(props.runAction);
    forceUpdate();
  }, [props.runAction]);

  useKey("Escape", () => {
    if (!props.open) return;
    if (activePageIndex === 0) {
      props.onCancel();
    } else {
      setActivePageIndex(0);
    }
  });

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

  function confirmRunAction() {
    if (!runAction.current) throw Error("Run action is not defined.");
    updateJSONString(runAction.current);
    const connections = skipConnections
      ? [props.connections[0]]
      : selectedConnections;
    props.onConfirmRunAction(
      runAction.current,
      connections,
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

  function getPages() {
    const pages: React.ReactNode[] = [];
    if (!skipArgs) pages.push(argsPage);
    if (!skipConnections) pages.push(connectionsPage);
    if (!props.skipConfirmation) pages.push(confirmationPage);
    return pages;
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

  const pages = useMemo(getPages, [
    skipArgs,
    skipConnections,
    props.skipConfirmation,
    runAction.current,
  ]);

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
              (!skipConnections &&
                selectedConnections.length === 0 &&
                ((activePageIndex === 0 && skipArgs) ||
                  (activePageIndex === 1 && !skipArgs)))
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
