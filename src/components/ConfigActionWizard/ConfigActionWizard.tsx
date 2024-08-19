import { useImmer } from "use-immer";
import { R_Wizard } from "../Wizard/Wizard";
import { R_FAB } from "../FAB/FAB";
import { R_ActionCard } from "../ActionCard/ActionCard";
import { AnimatePresence } from "framer-motion";
import "./ConfigActionWizard.scss";
import { useEffect, useMemo, useRef } from "react";
import { R_Icon } from "../Icon/Icon";
import { R_SearchInput } from "../SearchInput/SearchInput";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { Action } from "../../modules/action";
import { R_StringOption } from "../StringOption/StringOption";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { R_ActionArgInputList } from "../ActionArgInputList/ActionArgInputList";
import { useKey } from "../../modules/use_key";
import { R_MultiColList } from "../MultiColList/MultiColList";
import { R_InfoCard } from "../InfoCard/InfoCard";

interface ConfigActionWizardProps {
  open: boolean;
  actions: Action[];
  onCancel: () => void;
  onActionConfigure: (action: Action, save: boolean) => void;
  onConfigCustomActions: () => void;
  runActionWizardOpen: boolean;
  customActionsWizardOpen: boolean;
}

export function R_ConfigActionWizard(props: ConfigActionWizardProps) {
  const [saveWithoutRunning, setSaveWithoutRunning] = useImmer(false);
  const [actionName, setActionName] = useImmer("");
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [filterValue, setFilterValue] = useImmer("");
  const configuredAction = useRef<Action | null>(null);
  const filterValueInput = useRef<HTMLInputElement>(null);

  const filteredActions = useMemo(() => {
    const filter = filterValue.toLowerCase();
    return props.actions.filter((action) => filterAction(action, filter));
  }, [filterValue, props.actions]);

  useEffect(() => {
    if (props.open) reset();
  }, [props.open]);

  useKey("Escape", () => {
    if (props.runActionWizardOpen || props.customActionsWizardOpen) return;
    if (activePageIndex === 0) {
      props.onCancel();
    } else {
      previousPage();
    }
  });

  useKey("/", () => {
    if (props.open) filterValueInput.current?.focus();
  });

  function filterAction(action: Action, filter: string) {
    if (action.name.toLowerCase().includes(filter)) return true;
    const filterKeywords = filter.split(" ");
    if (
      filterKeywords.filter(
        (filterKeyword) =>
          action.keywords.findIndex((actionKeyword) =>
            actionKeyword.includes(filterKeyword),
          ) !== -1,
      ).length === filterKeywords.length
    )
      return true;
  }

  function selectAction(action: Action) {
    configuredAction.current = structuredClone(action);
    setActionName(configuredAction.current.name);
    setActivePageIndex(1);
  }

  function clearActionSelection() {
    configuredAction.current = null;
  }

  function previousPage() {
    if (activePageIndex === 1) clearActionSelection();
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex - 1);
  }

  function onActionConfigurationConfirm() {
    configuredAction.current!.name = actionName;
    props.onActionConfigure(configuredAction.current!, saveWithoutRunning);
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
          <div className="sticky-filter">
            <R_Icon iconId="magnify" />
            <R_SearchInput
              placeholder='Filter actions (type "/" to focus)'
              onSearch={setFilterValue}
              ref={filterValueInput}
            />
          </div>
          <R_IconNotice
            iconId="filter-remove"
            hidden={filteredActions.length !== 0}
          >
            All actions have been filtered out.
          </R_IconNotice>
          <R_MultiColList items={props.actions} minColWidthPx={320}>
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
          </R_MultiColList>
        </>,
        <>
          <h2>{`Enter action args: ${configuredAction.current?.name}`}</h2>
          <R_InfoCard
            hidden={!configuredAction.current?.notice}
            id={`action-${configuredAction.current?.id}-notice`}
          >
            {configuredAction.current?.notice}
          </R_InfoCard>
          <R_IconNotice
            hidden={configuredAction.current?.args.length !== 0}
            iconId="emoticon-wink"
          >
            This action has no arguments to configure. You can skip adhead!
          </R_IconNotice>
          <R_ActionArgInputList
            configuredAction={configuredAction.current}
            onArgChange={(index, newValue) =>
              (configuredAction.current!.args[index].value = newValue)
            }
          />
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
            onClick={props.onCancel}
            iconId="close"
          />
          <R_FAB
            hidden={activePageIndex === 0}
            left
            title="Previous page"
            onClick={() => {
              previousPage();
            }}
            iconId="chevron-left"
          />
        </>
      }
      rightButton={
        <>
          <R_FAB
            hidden={activePageIndex !== 0}
            title="Config custom actions"
            iconId="pencil"
            onClick={props.onConfigCustomActions}
          />
          <R_FAB
            hidden={activePageIndex !== 1}
            title="Next page"
            iconId="chevron-right"
            onClick={() => {
              setActivePageIndex(2);
            }}
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
