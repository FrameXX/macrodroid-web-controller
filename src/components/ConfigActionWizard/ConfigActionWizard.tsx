import { useImmer } from "use-immer";
import R_Wizard from "../Wizard/Wizard";
import R_FAB from "../FAB/FAB";
import { ACTIONS } from "../../modules/const";
import R_ActionCard from "../ActionCard/ActionCard";
import { AnimatePresence, Target, motion } from "framer-motion";
import "./ConfigActionWizard.scss";
import { useMemo, useRef } from "react";
import useResizeObserver from "../../modules/use_resize_observer";
import R_Icon from "../Icon/Icon";
import R_SearchInput from "../SearchInput/SearchInput";
import R_IconNotice from "../IconNotice/IconNotice";
import { Action, ActionArgument } from "../../modules/action";
import R_ActionArgumentInput from "../ActionArgumentInput/ActionArgumentInput";

interface ConfigActionWizardProps {
  open: boolean;
  onClose: () => void;
}

export default function R_ConfigActionWizard(props: ConfigActionWizardProps) {
  // @ts-ignore
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [filterValue, setFilterValue] = useImmer("");
  const actionsContainer = useRef(null);
  const configuredAction = useRef<Action | null>(null);
  const [configuredArguments, setConfiguredArguments] = useImmer<
    ActionArgument<any>[]
  >([]);

  const secondColumn = useResizeObserver(
    actionsContainer,
    () => innerWidth > 550,
  );
  const thirdColumn = useResizeObserver(
    actionsContainer,
    () => innerWidth > 850,
  );
  const fourthColumn = useResizeObserver(
    actionsContainer,
    () => innerWidth > 1200,
  );

  let animateActions: Target;
  if (fourthColumn && ACTIONS.length > 3) {
    animateActions = { columns: 4 };
  } else if (thirdColumn && ACTIONS.length > 2) {
    animateActions = { columns: 3 };
  } else if (secondColumn && ACTIONS.length > 1) {
    animateActions = { columns: 2 };
  } else {
    animateActions = { columns: 1 };
  }

  const filteredActions = useMemo(() => {
    const filter = filterValue.toLowerCase();
    return ACTIONS.filter((action) =>
      action.name.toLowerCase().includes(filter),
    );
  }, [filterValue]);

  function selectAction(action: Action) {
    configuredAction.current = structuredClone(action);
    setConfiguredArguments(configuredAction.current.arguments);
    setActivePageIndex(1);
  }

  function clearActionSelection() {
    configuredAction.current = null;
    setConfiguredArguments([]);
  }

  function previousPage() {
    if (activePageIndex === 1) clearActionSelection();
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex - 1);
  }

  function shouldArgumentBeRendered(argument: ActionArgument<any>): boolean {
    if (!argument.useCondition) return true;
    return (
      configuredArguments[argument.useCondition.argumentIndex].value ===
      argument.useCondition.argumentValue
    );
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
            animate={animateActions}
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
          <h2>{configuredAction.current?.name}</h2>
          {configuredAction.current && (
            <div>
              <AnimatePresence>
                {configuredArguments.map(
                  (argument, index) =>
                    shouldArgumentBeRendered(argument) && (
                      <R_ActionArgumentInput
                        onChange={(newValue) => {
                          setConfiguredArguments((draft) => {
                            draft[index].value = newValue;
                          });
                        }}
                        key={`${configuredAction.current?.id}-${index}`}
                        argument={argument}
                      />
                    ),
                )}
              </AnimatePresence>
            </div>
          )}
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
        <R_FAB
          hidden={activePageIndex !== 0}
          title="Create custom action"
          iconId="plus"
          onClick={() => {}}
        />
      }
    />
  );
}
