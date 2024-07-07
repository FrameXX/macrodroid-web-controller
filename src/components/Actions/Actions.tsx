import { useImmer } from "use-immer";
import { R_Category } from "../Category/Category";
import { R_FAB } from "../FAB/FAB";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_ConfigActionWizard } from "../ConfigActionWizard/ConfigActionWizard";
import { Action } from "../../modules/action";
import { BakeToast } from "../../modules/toaster";
import { AnimatePresence } from "framer-motion";
import { R_ConfiguredActionCard } from "../ConfiguredActionCard/ConfiguredActionCard";
import "./Actions.scss";
import { OutgoingRequest } from "../../modules/outgoing_request";
import { Log } from "../../modules/logger";
import { Connection } from "../../modules/connection";
import { R_RunActionWizard } from "../RunActionWizard/RunActionWizard";

interface ActionsProps {
  bakeToast: BakeToast;
  log: Log;
  connections: Connection[];
}

export function R_Actions(props: ActionsProps) {
  const [configActionWizardOpen, setConfigActionWizardOpen] = useImmer(false);
  const [runActionWizardOpen, setRunActionWizardOpen] = useImmer(false);
  const [recentlyRunActions, setRunActions] = useImmer<Action[]>([]);
  const [savedActions, setSavedActions] = useImmer<Action[]>([]);
  const [runAction, setRunAction] = useImmer<Action | null>(null);

  function onActionConfigure(action: Action, save: boolean) {
    if (save) {
      addSavedAction(action);
      setConfigActionWizardOpen(false);
    } else {
      // Action has to be copyed so that the ConfigActionWizard can still modify its version.
      setRunAction(structuredClone(action));
      setRunActionWizardOpen(true);
    }
  }

  function dispatchAction(action: Action, connections: Connection[]) {
    setConfigActionWizardOpen(false);
    setRunActionWizardOpen(false);
    const request = OutgoingRequest.runAction(action);
    addRunAction(action);
  }

  function addRunAction(action: Action) {
    setRunActions((configuredActions) => {
      configuredActions.push(action);
      return configuredActions;
    });
  }

  function addSavedAction(action: Action) {
    setSavedActions((savedActions) => {
      savedActions.push(action);
      return savedActions;
    });
  }

  return (
    <>
      <R_Category defaultOpen name="Saved" iconId="star">
        <R_IconNotice hidden={savedActions.length > 0}>
          No actions saved
        </R_IconNotice>
        <div id="saved-actions">
          <AnimatePresence>
            {savedActions.map((action) => (
              <R_ConfiguredActionCard
                key={action.id}
                name={action.name}
                iconId={action.iconId}
              />
            ))}
          </AnimatePresence>
        </div>
      </R_Category>
      <R_Category defaultOpen name="Recently run" iconId="history">
        <R_IconNotice hidden={recentlyRunActions.length > 0}>
          No actions run
        </R_IconNotice>
        <div id="recently-run-actions">
          <AnimatePresence>
            {recentlyRunActions.map((action) => (
              <R_ConfiguredActionCard
                key={action.id}
                name={action.name}
                iconId={action.iconId}
              />
            ))}
          </AnimatePresence>
        </div>
      </R_Category>
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
        open={runActionWizardOpen}
        connections={props.connections}
        onCancel={() => setRunActionWizardOpen(false)}
        onActionRunConfirm={dispatchAction}
        runAction={runAction}
      />
    </>
  );
}
