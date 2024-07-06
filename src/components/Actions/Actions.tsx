import { useImmer } from "use-immer";
import R_Category from "../Category/Category";
import R_FAB from "../FAB/FAB";
import R_IconNotice from "../IconNotice/IconNotice";
import R_ConfigActionWizard from "../ConfigActionWizard/ConfigActionWizard";
import { Action } from "../../modules/action";
import { BakeToast } from "../../modules/toaster";
import { AnimatePresence } from "framer-motion";
import R_ConfiguredActionCard from "../ConfiguredActionCard/ConfiguredActionCard";
import "./Actions.scss";
import { OutgoingRequest } from "../../modules/outgoing_request";
import { Log } from "../../modules/logger";

interface ActionsProps {
  bakeToast: BakeToast;
  log: Log;
}

export default function R_Actions(props: ActionsProps) {
  const [configActionWizardOpen, setConfigActionWizardOpen] = useImmer(false);
  const [runActions, setRunActions] = useImmer<Action[]>([]);
  const [savedActions, setSavedActions] = useImmer<Action[]>([]);

  function onActionConfigure(action: Action, save: boolean) {
    setConfigActionWizardOpen(false);
    if (save) {
      addSavedAction(action);
    } else {
      addRunAction(action);
    }
  }

  function runAction(action: Action) {
    const request = OutgoingRequest.runAction(action);
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
        <R_IconNotice hidden={runAction.length > 0}>
          No actions run
        </R_IconNotice>
        <div id="configured-actions">
          <AnimatePresence>
            {runActions.map((action) => (
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
        onClose={() => setConfigActionWizardOpen(false)}
        onActionConfigure={onActionConfigure}
      />
    </>
  );
}
