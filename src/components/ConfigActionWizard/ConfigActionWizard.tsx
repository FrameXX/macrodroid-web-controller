import { useImmer } from "use-immer";
import { R_Wizard } from "../Wizard/Wizard";
import { R_FAB } from "../FAB/FAB";
import { ACTIONS } from "../../modules/const";
import { R_ActionCard } from "../ActionCard/ActionCard";
import { AnimatePresence, motion } from "framer-motion";
import "./ConfigActionWizard.scss";
import { useMemo, useRef } from "react";
import { R_Icon } from "../Icon/Icon";
import { R_SearchInput } from "../SearchInput/SearchInput";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { Action, ActionArgument } from "../../modules/action";
import { R_ActionArgumentInput } from "../ActionArgumentInput/ActionArgumentInput";
import { useColumnDeterminator } from "../../modules/use_column_determinator";
import { BakeToast, Toast, ToastSeverity } from "../../modules/toaster";
import { R_StringOption } from "../StringOption/StringOption";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";

interface ConfigActionWizardProps {
  open: boolean;
  onClose: () => void;
  onActionConfigure: (action: Action, save: boolean) => void;
  bakeToast: BakeToast;
}

export function R_ConfigActionWizard(props: ConfigActionWizardProps) {
  // @ts-ignore
  const [saveWithoutRunning, setSaveWithoutRunning] = useImmer(false);
  const [actionName, setActionName] = useImmer("");
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [filterValue, setFilterValue] = useImmer("");
  const actionsContainer = useRef(null);
  const actionArgsContainer = useRef(null);
  const configuredAction = useRef<Action | null>(null);
  const [configuredArgs, setConfiguredArgs] = useImmer<ActionArgument<any>[]>(
    [],
  );

  const actionsColumns = useColumnDeterminator(actionsContainer, ACTIONS, 270);
  const actionArgsColumns = useColumnDeterminator(
    actionArgsContainer,
    configuredArgs,
    400,
  );

  const filteredActions = useMemo(() => {
    const filter = filterValue.toLowerCase();
    return ACTIONS.filter((action) =>
      action.name.toLowerCase().includes(filter),
    );
  }, [filterValue]);

  function selectAction(action: Action) {
    configuredAction.current = structuredClone(action);
    setConfiguredArgs(configuredAction.current.args);
    setActionName(configuredAction.current.name);
    setActivePageIndex(1);
  }

  function clearActionSelection() {
    configuredAction.current = null;
    setConfiguredArgs([]);
  }

  function previousPage() {
    if (activePageIndex === 1) clearActionSelection();
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex - 1);
  }

  function shouldArgumentBeRendered(argument: ActionArgument<any>): boolean {
    if (!argument.useCondition) return true;
    return (
      configuredArgs[argument.useCondition.argumentIndex].value ===
      argument.useCondition.argumentValue
    );
  }

  function onActionConfigurationConfirm() {
    configuredAction.current!.name = actionName;
    props.onActionConfigure(configuredAction.current!, saveWithoutRunning);
    props.bakeToast(
      new Toast("Action configured.", "play", ToastSeverity.Success),
    );
    reset();
  }

  function reset() {
    clearActionSelection();
    setActivePageIndex(0);
    setSaveWithoutRunning(false);
  }

  return (
    <R_Wizard
      open={props.open}
      pages={[
        <>
          <h2>Choose action or create a custom one</h2>
          <div id="actions-filter">
            <R_Icon iconId="magnify" />
            <R_SearchInput
              placeholder="Filter actions"
              onSearch={setFilterValue}
            />
          </div>
          <R_IconNotice
            iconId="filter-remove"
            hidden={filteredActions.length !== 0}
          >
            All actions have been filtered out.
          </R_IconNotice>
          <motion.div
            ref={actionsContainer}
            id="actions"
            animate={{ columns: actionsColumns }}
          >
            <AnimatePresence>
              {filteredActions.map((action) => (
                <R_ActionCard
                  key={action.id}
                  name={action.name}
                  iconId={action.iconId}
                  onClick={() => {
                    selectAction(action);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </>,
        <>
          <h2>{`Enter action args - ${configuredAction.current?.name}`}</h2>
          <motion.div
            id="action-args"
            animate={{ columns: actionArgsColumns }}
            ref={actionArgsContainer}
          >
            {configuredAction.current && (
              <AnimatePresence>
                {configuredArgs.map(
                  (argument, index) =>
                    shouldArgumentBeRendered(argument) && (
                      <R_ActionArgumentInput
                        onChange={(newValue) => {
                          setConfiguredArgs((configuredArgs) => {
                            configuredArgs[index].value = newValue;
                          });
                        }}
                        key={`${configuredAction.current?.id}-${index}`}
                        argument={argument}
                      />
                    ),
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </>,
        <>
          <h2>Extra options</h2>
          <R_BooleanOption
            value={saveWithoutRunning}
            title="Save without running"
            iconId="star-plus"
            onChange={(newValue) => setSaveWithoutRunning(newValue)}
          />
          <R_StringOption
            iconId="rename"
            value={actionName}
            type="text"
            maxLength={40}
            onChange={(newValue) => setActionName(newValue)}
            placeholder="Enter configured action name"
            title="Rename configured action"
            description="You can rename the action to differentiate it from other actions of the same type. This is not so important if you want to just run the action and never save it."
          />
        </>,
      ]}
      activePageIndex={activePageIndex}
      leftButton={
        <>
          <R_FAB
            hidden={activePageIndex !== 0}
            left
            title="Cancel configuration of new action"
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
        <>
          <R_FAB
            hidden={activePageIndex !== 0}
            title="Create custom action"
            iconId="plus"
            onClick={() => {}}
          />
          <R_FAB
            hidden={activePageIndex !== 1}
            title="Next page"
            iconId="chevron-right"
            onClick={() => setActivePageIndex(2)}
          />
          <R_FAB
            hidden={activePageIndex !== 2}
            title="Confirm action configuration"
            iconId="check"
            onClick={onActionConfigurationConfirm}
          />
        </>
      }
    />
  );
}
