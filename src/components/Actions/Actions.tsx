import { useImmer } from "use-immer";
import { R_ExpandableCategory } from "../ExpandableCategory/ExpandableCategory";
import { R_FAB } from "../FAB/FAB";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_ConfigActionWizard } from "../ConfigActionWizard/ConfigActionWizard";
import {
  Action,
  ActionArg,
  ActionsStruct,
  updateJSONString,
} from "../../modules/action";
import { BakeToast, Toast, ToastSeverity } from "../../modules/toaster";
import { AnimatePresence } from "framer-motion";
import { R_ConfiguredActionCard } from "../ConfiguredActionCard/ConfiguredActionCard";
import "./Actions.scss";
import { OutgoingRequest } from "../../modules/outgoing_request";
import { Log } from "../../modules/logger";
import { Connection } from "../../modules/connection";
import { R_RunActionWizard } from "../RunActionWizard/RunActionWizard";
import { useLocalStorage } from "../../modules/use_local_storage";
import { ACTIONS, RECENT_ACTIONS_LIMIT } from "../../modules/const";
import { R_CreateActionWizard } from "../CreateActionWizard/CreateActionWizard";
import { R_CreateArgumentWizard } from "../CreateArgumentWizard/CreateArgumentWizard";
import { moveElement } from "../../modules/misc";
import { useMemo } from "react";
import { Confirm } from "../../modules/confirm_dialog";

interface ActionsProps {
  confirm: Confirm;
  bakeToast: BakeToast;
  log: Log;
  connections: Connection[];
  onRecoverError: (errorMessage: string, name: string) => void;
}

export function R_Actions(props: ActionsProps) {
  const [configActionWizardOpen, setConfigActionWizardOpen] = useImmer(false);
  const [runActionWizardOpen, setRunActionWizardOpen] = useImmer(false);
  const [createActionWizardOpen, setCreateActionWizardOpen] = useImmer(false);
  const [createArgumentWizardOpen, setCreateArgumentWizardOpen] =
    useImmer(false);
  const [recentActions, setRecentActions] = useImmer<Action[]>([]);
  const [savedActions, setSavedActions] = useImmer<Action[]>([]);
  const [runAction, setRunAction] = useImmer<Action | null>(null);
  const [runActionWizardSkipArgs, setRunActionWizardSkipArgs] = useImmer(false);
  const [newActionArgs, setNewActionArgs] = useImmer<ActionArg<any>[]>([]);
  const [customActions, setCustomActions] = useImmer<Action[]>([]);
  const actions = useMemo(() => {
    console.log(customActions);
    return [...ACTIONS, ...customActions];
  }, [customActions]);

  useLocalStorage(customActions, setCustomActions, {
    storageKey: "customActions",
    struct: ActionsStruct,
    stringify: JSON.stringify,
    parse: JSON.parse,
    onRecoverError: (errorMessage) => {
      props.onRecoverError(errorMessage, "custom actions");
    },
  });
  useLocalStorage(savedActions, setSavedActions, {
    storageKey: "savedActions",
    struct: ActionsStruct,
    stringify: JSON.stringify,
    parse: JSON.parse,
    onRecoverError: (errorMessage) => {
      props.onRecoverError(errorMessage, "saved actions");
    },
  });
  useLocalStorage(recentActions, setRecentActions, {
    storageKey: "recentlyRunActions",
    struct: ActionsStruct,
    stringify: JSON.stringify,
    parse: JSON.parse,
    onRecoverError: (errorMessage) => {
      props.onRecoverError(errorMessage, "recently run actions");
    },
  });

  function openConfigActionWizard() {
    setConfigActionWizardOpen(true);
  }

  function closeConfigActionWizard() {
    setConfigActionWizardOpen(false);
  }

  function openCreateActionWizard() {
    setCreateActionWizardOpen(true);
  }

  function closeCreateActionWizard() {
    setCreateActionWizardOpen(false);
  }

  function openAddArgumentWizard() {
    setCreateArgumentWizardOpen(true);
  }

  function closeAddArgumentWizard() {
    setCreateArgumentWizardOpen(false);
  }

  function openRunActionWizard() {
    setRunActionWizardOpen(true);
  }

  function closeRunActionWizard() {
    setRunActionWizardOpen(false);
  }

  function onActionConfigure(action: Action, save: boolean) {
    updateJSONString(action);
    if (save) {
      addSavedAction(action);
      setConfigActionWizardOpen(false);
    } else {
      runRunActionWizard(action, true);
    }
  }

  function runRunActionWizard(action: Action, skipArgs: boolean) {
    // Action has to be copyed so that the ConfigActionWizard can still modify its version.
    setRunAction(structuredClone(action));
    setRunActionWizardSkipArgs(skipArgs);
    openRunActionWizard();
  }

  async function dispatchAction(action: Action, connections: Connection[]) {
    setRunActionWizardSkipArgs(false);
    const request = OutgoingRequest.runAction(action);
    for (const connection of connections) {
      const logRecord = await connection.makeRequest(request);
      props.log(logRecord);
    }
    addRecentAction(action);
  }

  function addRecentAction(action: Action) {
    if (recentActions.length >= RECENT_ACTIONS_LIMIT)
      setRecentActions((recentActions) => {
        recentActions.pop();
        return recentActions;
      });

    const sameActionIndex = recentActions.findIndex((recentAction) => {
      return recentAction.JSONstring === action.JSONstring;
    });
    if (sameActionIndex !== -1) {
      setRecentActions((draft) => {
        moveElement(draft, sameActionIndex, 0);
        return draft;
      });
      return;
    }

    setRecentActions((recentActions) => {
      recentActions.unshift(action);
      return recentActions;
    });
  }

  function addSavedAction(action: Action) {
    const sameActions = savedActions.filter((savedAction) => {
      return savedAction.JSONstring === action.JSONstring;
    });
    if (sameActions.length > 0) {
      props.bakeToast(
        new Toast(
          "Saving cancelled. You already have the same action with the same configuration saved.",
          "cancel",
          ToastSeverity.Error,
        ),
      );
      return;
    }
    setSavedActions((savedActions) => {
      savedActions.push(action);
      return savedActions;
    });
    props.bakeToast(new Toast("Action saved.", "star", ToastSeverity.Success));
  }

  function unsaveAction(index: number) {
    setSavedActions((savedActions) => {
      savedActions.splice(index, 1);
      return savedActions;
    });
  }

  function saveActionFromRecentActions(index: number) {
    addSavedAction(recentActions[index]);
  }

  function addNewActionArg(arg: ActionArg<any>) {
    setNewActionArgs((draft) => {
      draft.push(arg);
      return draft;
    });
  }

  function handleArgCreation(arg: ActionArg<any>) {
    addNewActionArg(arg);
    closeAddArgumentWizard();
  }

  function deleteNewActionArgs(index: number) {
    setNewActionArgs((draft) => {
      draft.splice(index, 1);
      return draft;
    });
  }

  function moveDownNewActionArg(index: number) {
    setNewActionArgs((draft) => {
      moveElement(draft, index, index + 1);
      return draft;
    });
  }

  function moveUpNewActionArg(index: number) {
    setNewActionArgs((draft) => {
      moveElement(draft, index, index - 1);
      return draft;
    });
  }

  function handleActionCreation(action: Action) {
    setNewActionArgs([]);
    closeCreateActionWizard();
    setCustomActions((draft) => {
      draft.push(action);
      return draft;
    });
  }

  return (
    <>
      <R_ExpandableCategory defaultOpen name="Saved" iconId="star">
        <R_IconNotice hidden={savedActions.length > 0}>
          No actions saved
        </R_IconNotice>
        <div id="saved-actions">
          <AnimatePresence>
            {savedActions.map((action, index) => (
              <R_ConfiguredActionCard
                saved
                onToggleSave={() => unsaveAction(index)}
                key={action.JSONstring}
                name={action.name}
                iconId={action.iconId}
                onRun={() => runRunActionWizard(action, false)}
              />
            ))}
          </AnimatePresence>
        </div>
      </R_ExpandableCategory>
      <R_ExpandableCategory defaultOpen name="Recently run" iconId="history">
        <R_IconNotice hidden={recentActions.length > 0}>
          No actions run
        </R_IconNotice>
        <div id="recent-actions">
          <AnimatePresence>
            {recentActions.map((action, index) => (
              <R_ConfiguredActionCard
                onToggleSave={() => saveActionFromRecentActions(index)}
                key={action.JSONstring}
                name={action.name}
                iconId={action.iconId}
                onRun={() => runRunActionWizard(action, false)}
              />
            ))}
          </AnimatePresence>
        </div>
      </R_ExpandableCategory>
      <R_FAB
        onClick={openConfigActionWizard}
        title="Configure new action"
        iconId="cog-play"
      />
      <R_ConfigActionWizard
        actions={actions}
        createActionWizardOpen={createActionWizardOpen}
        runActionWizardOpen={runActionWizardOpen}
        open={configActionWizardOpen}
        onCancel={closeConfigActionWizard}
        onActionConfigure={onActionConfigure}
        onStartActionCreation={openCreateActionWizard}
      />
      <R_RunActionWizard
        bakeToast={props.bakeToast}
        skipArgs={runActionWizardSkipArgs}
        open={runActionWizardOpen}
        connections={props.connections}
        onCancel={closeRunActionWizard}
        onConfirmRunAction={(action, connections) => {
          closeConfigActionWizard();
          closeRunActionWizard();
          dispatchAction(action, connections);
        }}
        runAction={runAction}
      />
      <R_CreateActionWizard
        confirm={props.confirm}
        actions={actions}
        args={newActionArgs}
        createArgumentWizardOpen={createArgumentWizardOpen}
        open={createActionWizardOpen}
        onCancel={closeCreateActionWizard}
        onStartArgumentCreation={openAddArgumentWizard}
        onCreate={handleActionCreation}
        onArgDelete={deleteNewActionArgs}
        onArgMoveDown={moveDownNewActionArg}
        onArgMoveUp={moveUpNewActionArg}
      />
      <R_CreateArgumentWizard
        confirm={props.confirm}
        otherArgs={newActionArgs}
        open={createArgumentWizardOpen}
        onCancel={closeAddArgumentWizard}
        onCreate={handleArgCreation}
      />
    </>
  );
}
