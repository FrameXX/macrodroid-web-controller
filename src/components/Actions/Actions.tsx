import { useImmer } from "use-immer";
import { R_ExpandableCategory } from "../ExpandableCategory/ExpandableCategory";
import { R_FAB } from "../FAB/FAB";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_ConfigActionWizard } from "../ConfigActionWizard/ConfigActionWizard";
import { Action, ActionsStruct } from "../../modules/action";
import { BakeToast } from "../../modules/toaster";
import { AnimatePresence } from "framer-motion";
import { R_ConfiguredActionCard } from "../ConfiguredActionCard/ConfiguredActionCard";
import "./Actions.scss";
import { OutgoingRequest } from "../../modules/outgoing_request";
import { Log } from "../../modules/logger";
import { Connection } from "../../modules/connection";
import { R_RunActionWizard } from "../RunActionWizard/RunActionWizard";
import { useLocalStorage } from "../../modules/use_local_storage";
import { RECENT_ACTIONS_LIMIT } from "../../modules/const";

interface ActionsProps {
  bakeToast: BakeToast;
  log: Log;
  connections: Connection[];
  onRecoverError: (errorMessage: string, name: string) => void;
}

export function R_Actions(props: ActionsProps) {
  const [configActionWizardOpen, setConfigActionWizardOpen] = useImmer(false);
  const [runActionWizardOpen, setRunActionWizardOpen] = useImmer(false);
  const [recentActions, setRecentActions] = useImmer<Action[]>([]);
  const [savedActions, setSavedActions] = useImmer<Action[]>([]);
  const [runAction, setRunAction] = useImmer<Action | null>(null);
  const [runActionWizardSkipArgs, setRunActionWizardSkipArgs] = useImmer(false);

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

  function onActionConfigure(action: Action, save: boolean) {
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
    setRunActionWizardOpen(true);
  }

  async function dispatchAction(action: Action, connections: Connection[]) {
    setConfigActionWizardOpen(false);
    setRunActionWizardOpen(false);
    setRunActionWizardSkipArgs(false);
    const request = OutgoingRequest.runAction(action);
    console.log(connections);
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
    setRecentActions((recentActions) => {
      recentActions.unshift(action);
      return recentActions;
    });
  }

  function addSavedAction(action: Action) {
    setSavedActions((savedActions) => {
      savedActions.push(action);
      return savedActions;
    });
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
                key={`${action.id}-${index}`}
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
                key={`${action.id}-${index}`}
                name={action.name}
                iconId={action.iconId}
                onRun={() => runRunActionWizard(action, false)}
              />
            ))}
          </AnimatePresence>
        </div>
      </R_ExpandableCategory>
      <R_FAB
        onClick={() => setConfigActionWizardOpen(true)}
        title="Configure new action"
        iconId="cog-play"
      />
      <R_ConfigActionWizard
        bakeToast={props.bakeToast}
        open={configActionWizardOpen}
        onCancel={() => setConfigActionWizardOpen(false)}
        onActionConfigure={onActionConfigure}
      />
      <R_RunActionWizard
        bakeToast={props.bakeToast}
        skipArgs={runActionWizardSkipArgs}
        open={runActionWizardOpen}
        connections={props.connections}
        onCancel={() => setRunActionWizardOpen(false)}
        onActionRunConfirm={dispatchAction}
        runAction={runAction}
      />
    </>
  );
}
