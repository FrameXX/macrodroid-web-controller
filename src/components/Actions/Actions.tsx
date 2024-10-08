import { useImmer } from "use-immer";
import { R_ExpandableCategory } from "../ExpandableCategory/ExpandableCategory";
import { R_FAB } from "../FAB/FAB";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_ConfigActionWizard } from "../ConfigActionWizard/ConfigActionWizard";
import {
  Action,
  ActionArg,
  ActionsStruct,
  parseActionArg,
} from "../../modules/action";
import { BakeToast, ToastSeverity } from "../../modules/toaster";
import { AnimatePresence } from "framer-motion";
import { R_ConfiguredActionCard } from "../ConfiguredActionCard/ConfiguredActionCard";
import "./Actions.scss";
import { OutgoingRequest } from "../../modules/outgoing_request";
import { Log, LogRecordInitializer } from "../../modules/logger";
import { Connection } from "../../modules/connection";
import { R_RunActionWizard } from "../RunActionWizard/RunActionWizard";
import { useLocalStorage } from "../../modules/use_local_storage";
import {
  ACTIONS,
  CUSTOM_ACTIONS_STORAGE_KEY,
  RECENT_ACTIONS_LIMIT,
  RECENT_ACTIONS_STORAGE_KEY,
  REQUIRE_CONFIRMATION_PARAM_NAME,
  SAVED_ACTIONS_STORAGE_KEY,
} from "../../modules/const";
import { R_CreateActionWizard } from "../CreateActionWizard/CreateActionWizard";
import { R_CreateArgumentWizard } from "../CreateArgumentWizard/CreateArgumentWizard";
import { moveElement, stringifyError } from "../../modules/misc";
import { useEffect, useMemo } from "react";
import { Confirm } from "../../modules/confirm_dialog";
import { R_CustomActionsWizard } from "../CustomActionsWizard/CustomActionsWizard";
import { R_CreateActionLinkWizard } from "../CreateActionLinkWizard/CreateActionLinkWizard";

interface ActionsProps {
  confirm: Confirm;
  bakeToast: BakeToast;
  log: Log;
  connections: Connection[];
  connectionsRecovered: boolean;
  onRecoverError: (errorMessage: string, name: string) => void;
  onDispatchActionFromURLParams: () => unknown;
}

export function R_Actions(props: ActionsProps) {
  const [configActionWizardOpen, setConfigActionWizardOpen] = useImmer(false);
  const [runActionWizardOpen, setRunActionWizardOpen] = useImmer(false);
  const [createActionWizardOpen, setCreateActionWizardOpen] = useImmer(false);
  const [createArgumentWizardOpen, setCreateArgumentWizardOpen] =
    useImmer(false);
  const [customActionsWizardOpen, setCustomActionsWizardOpen] = useImmer(false);
  const [createActionLinkWizardOpen, setCreateActionLinkWizardOpen] =
    useImmer(false);
  const [recentActions, setRecentActions] = useImmer<Action[]>([]);
  const [savedActions, setSavedActions] = useImmer<Action[]>([]);
  const [runAction, setRunAction] = useImmer<Action | null>(null);
  const [createLinkAction, setCreateLinkAction] = useImmer<Action | null>(null);
  const [runActionWizardSkipArgs, setRunActionWizardSkipArgs] = useImmer(false);
  const [runActionWizardSkipConfirmation, setRunActionWizardSkipConfirmation] =
    useImmer(false);
  const [newActionArgs, setNewActionArgs] = useImmer<ActionArg<unknown>[]>([]);
  const [customActions, setCustomActions] = useImmer<Action[]>([]);
  const actions = useMemo(() => {
    return [...ACTIONS, ...customActions];
  }, [customActions]);

  useLocalStorage(customActions, setCustomActions, {
    storageKey: CUSTOM_ACTIONS_STORAGE_KEY,
    struct: ActionsStruct,
    stringify: JSON.stringify,
    parse: JSON.parse,
    onRecoverError: (errorMessage) => {
      props.onRecoverError(errorMessage, "custom actions");
    },
  });
  useLocalStorage(savedActions, setSavedActions, {
    storageKey: SAVED_ACTIONS_STORAGE_KEY,
    struct: ActionsStruct,
    stringify: JSON.stringify,
    parse: JSON.parse,
    onRecoverError: (errorMessage) => {
      props.onRecoverError(errorMessage, "saved actions");
    },
  });
  useLocalStorage(recentActions, setRecentActions, {
    storageKey: RECENT_ACTIONS_STORAGE_KEY,
    struct: ActionsStruct,
    stringify: JSON.stringify,
    parse: JSON.parse,
    onRecoverError: (errorMessage) => {
      props.onRecoverError(errorMessage, "recently run actions");
    },
  });

  useEffect(() => {
    if (!props.connectionsRecovered) return;
    if (isActionURLParamPresent()) dispatchActionFromURLParams();
  }, [props.connectionsRecovered]);

  function dispatchActionFromURLParams() {
    let actionDispatchArgs: [Action, Connection[], boolean];
    try {
      actionDispatchArgs = parseActionURLParams();
    } catch (error) {
      props.bakeToast({
        message: `Action URL parsing failed. ${stringifyError(error)}.`,
        iconId: "alert",
        severity: ToastSeverity.Error,
      });
      return;
    }
    dispatchAction(...actionDispatchArgs);
    props.onDispatchActionFromURLParams();
  }

  function isActionURLParamPresent() {
    const urlParams = new URLSearchParams(location.search);
    const actionArg = urlParams.get("action");
    return actionArg !== null;
  }

  function parseActionURLParams(): [Action, Connection[], boolean] {
    const urlParams = new URLSearchParams(location.search);

    function getAction() {
      const actionId = urlParams.get("id");
      if (!actionId) throw new Error("Action ID is missing from URL params.");
      const matchingActionIndex = actions.findIndex((action) => {
        return action.id === actionId;
      });
      if (matchingActionIndex === -1)
        throw new Error("Action ID was not found in actions list.");
      return structuredClone(actions[matchingActionIndex]);
    }

    function getConnections() {
      const connectionIdsParam = urlParams.getAll("connectionId");
      if (connectionIdsParam.length === 0)
        throw new Error("Connection ID is missing from URL params.");
      const connections: Connection[] = [];
      for (const connectionId of connectionIdsParam) {
        const matchingConnectionIndex = props.connections.findIndex(
          (connection) => {
            return connection.id === connectionId;
          },
        );
        if (matchingConnectionIndex === -1)
          throw new Error(
            `Connection ID ${connectionId} was not found in connections list.`,
          );
        connections.push(props.connections[matchingConnectionIndex]);
      }
      return connections;
    }

    const action = getAction();
    const connections = getConnections();

    const requireConfirmation = urlParams.has(REQUIRE_CONFIRMATION_PARAM_NAME);

    for (const argIndex in action.args) {
      const id = action.args[argIndex].id;
      const paramValue = urlParams.get(`arg_${id}`);
      if (paramValue === null)
        throw new Error(
          `Action argument ${id} is missing from URL params. It should be present with "arg_" prefix.`,
        );
      action.args[argIndex].value = parseActionArg(
        paramValue,
        action.args[argIndex].type,
      );
    }

    return [action, connections, requireConfirmation];
  }

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

  function closeRunActionWizard() {
    setRunActionWizardOpen(false);
  }

  function closeCustomActionsWizard() {
    setCustomActionsWizardOpen(false);
  }

  function openCustomActionsWizard() {
    setCustomActionsWizardOpen(true);
  }

  function closeCreateActionLinkWizard() {
    setCreateActionLinkWizardOpen(false);
  }

  function openCreateActionLinkWizard(action: Action) {
    setCreateLinkAction(action);
    setCreateActionLinkWizardOpen(true);
  }

  function onActionConfigure(action: Action, save: boolean) {
    if (save) {
      addSavedAction(action);
      setConfigActionWizardOpen(false);
    } else {
      handleActionRunRequest(action, true);
    }
  }

  function openRunActionWizard(
    action: Action,
    skipArgs = false,
    skipConfirmation = false,
  ) {
    // Action has to be copied so that the RunActionWizard can still modify its own version.
    setRunAction(structuredClone(action));
    setRunActionWizardSkipArgs(skipArgs);
    setRunActionWizardSkipConfirmation(skipConfirmation);
    setRunActionWizardOpen(true);
  }

  async function dispatchAction(
    action: Action,
    connections: Connection[],
    requireConfirmation: boolean,
  ) {
    if (connections.length === 0)
      throw new Error("No connections to dispatch the action were provided.");
    props.bakeToast({ message: "Dispatching action.", iconId: "play" });
    addRecentAction(action);
    const request = OutgoingRequest.createActionRequest(
      action,
      requireConfirmation,
    );
    const requestLogs: LogRecordInitializer[] = [];
    const logPromises = connections.map(async (connection) => {
      const requestLog = await connection.makeRequest(request);
      props.log(requestLog);
      requestLogs.push(requestLog);
    });
    await Promise.all(logPromises);
    const someRequestFailed =
      requestLogs.findIndex(
        (requestLog) => typeof requestLog.errorMessage !== "undefined",
      ) !== -1;
    if (someRequestFailed) {
      props.bakeToast({
        message:
          "Some action webhook trigger requests have failed. See the log for more info.",
        iconId: "alert",
        severity: ToastSeverity.Error,
      });
    } else {
      props.bakeToast({
        message:
          "Action webhook trigger was successfully requested for all connections.",
        iconId: "webhook",
        severity: ToastSeverity.Success,
      });
    }
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
      if (sameActionIndex !== 0)
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
      props.bakeToast({
        message:
          "Saving cancelled. You already have the same action with the same configuration saved.",
        iconId: "cancel",
        severity: ToastSeverity.Error,
      });
      return;
    }
    setSavedActions((savedActions) => {
      savedActions.push(action);
      return savedActions;
    });
    props.bakeToast({ message: "Action saved.", iconId: "star" });
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

  function addNewActionArg(arg: ActionArg<unknown>) {
    setNewActionArgs((draft) => {
      draft.push(arg);
      return draft;
    });
  }

  function handleArgCreation(arg: ActionArg<unknown>) {
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

  function deleteCustomAction(index: number) {
    setCustomActions((draft) => {
      draft.splice(index, 1);
      return draft;
    });
  }

  function handleConfirmRunAction(
    action: Action,
    connections: Connection[],
    requireConfirmation: boolean,
  ) {
    closeConfigActionWizard();
    closeRunActionWizard();
    setRunActionWizardSkipArgs(false);
    setRunActionWizardSkipConfirmation(false);
    dispatchAction(action, connections, requireConfirmation);
  }

  function handleActionLinkCreationRequest(action: Action) {
    if (props.connections.length === 0) {
      props.bakeToast({
        message:
          "There are no configured connections that the link could target.",
        iconId: "transit-connection-variant",
        severity: ToastSeverity.Error,
      });
      return;
    }
    openCreateActionLinkWizard(action);
  }

  function handleActionRunRequest(
    action: Action,
    skipArgs = false,
    skipConfirmation = false,
  ) {
    if (props.connections.length === 0) {
      props.bakeToast({
        message: "There are no configured connections to trigger actions on.",
        iconId: "transit-connection-variant",
        severity: ToastSeverity.Error,
      });
      return;
    }

    if (skipArgs && skipConfirmation && props.connections.length === 1) {
      dispatchAction(action, props.connections, false);
      return;
    }

    openRunActionWizard(action, skipArgs, skipConfirmation);
  }

  return (
    <>
      <R_ExpandableCategory defaultOpen name="Saved" iconId="star">
        <R_IconNotice
          title="No actions saved"
          description="Create new action by clicking the + button in the bottom right
            corner."
          hidden={savedActions.length > 0}
        />
        <div id="saved-actions">
          <AnimatePresence>
            {savedActions.map((action, index) => (
              <R_ConfiguredActionCard
                saved
                onCreateLink={() => handleActionLinkCreationRequest(action)}
                onToggleSave={() => unsaveAction(index)}
                key={action.JSONstring}
                name={action.name}
                iconId={action.iconId}
                onRun={() => handleActionRunRequest(action, true, true)}
                onRunWithOptions={() => handleActionRunRequest(action)}
              />
            ))}
          </AnimatePresence>
        </div>
      </R_ExpandableCategory>
      <R_ExpandableCategory defaultOpen name="Recently run" iconId="history">
        <R_IconNotice
          title="No actions run"
          description="Run new action by clicking the + button in the bottom right corner."
          hidden={recentActions.length > 0}
        />
        <div id="recent-actions">
          <AnimatePresence>
            {recentActions.map((action, index) => (
              <R_ConfiguredActionCard
                onCreateLink={() => handleActionLinkCreationRequest(action)}
                onToggleSave={() => saveActionFromRecentActions(index)}
                key={action.JSONstring}
                name={action.name}
                iconId={action.iconId}
                onRun={() => handleActionRunRequest(action, true, true)}
                onRunWithOptions={() => handleActionRunRequest(action)}
              />
            ))}
          </AnimatePresence>
        </div>
      </R_ExpandableCategory>
      <R_FAB
        onClick={openConfigActionWizard}
        title="Configure new action"
        iconId="plus"
      />
      <R_ConfigActionWizard
        actions={actions}
        customActionsWizardOpen={customActionsWizardOpen}
        runActionWizardOpen={runActionWizardOpen}
        open={configActionWizardOpen}
        onCancel={closeConfigActionWizard}
        onActionConfigure={onActionConfigure}
        onConfigCustomActions={openCustomActionsWizard}
      />
      <R_CreateActionLinkWizard
        bakeToast={props.bakeToast}
        action={createLinkAction}
        open={createActionLinkWizardOpen}
        connections={props.connections}
        onCancel={closeCreateActionLinkWizard}
      />
      <R_RunActionWizard
        skipConfirmation={runActionWizardSkipConfirmation}
        skipArgs={runActionWizardSkipArgs}
        open={runActionWizardOpen}
        connections={props.connections}
        onCancel={closeRunActionWizard}
        onConfirmRunAction={handleConfirmRunAction}
        runAction={runAction}
      />
      <R_CustomActionsWizard
        onCustomActionDelete={deleteCustomAction}
        createActionWizardOpen={createActionWizardOpen}
        actions={customActions}
        open={customActionsWizardOpen}
        onClose={closeCustomActionsWizard}
        onOpenCreateActionWizard={openCreateActionWizard}
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
