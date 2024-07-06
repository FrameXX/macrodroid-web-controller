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

interface ActionsProps {
  bakeToast: BakeToast;
}

export default function R_Actions(props: ActionsProps) {
  const [configActionWizardOpen, setConfigActionWizardOpen] = useImmer(false);
  const [configuredActions, setConfiguredActions] = useImmer<Action[]>([]);

  function onActionConfigure(action: Action) {
    setConfigActionWizardOpen(false);
    addConfiguredAction(action);
  }

  function addConfiguredAction(action: Action) {
    setConfiguredActions((configuredActions) => {
      configuredActions.push(action);
      return configuredActions;
    });
  }

  return (
    <>
      <R_Category defaultOpen name="Saved" iconId="star">
        <R_IconNotice>No actions saved</R_IconNotice>
      </R_Category>
      <R_Category defaultOpen name="Configured" iconId="cog">
        <R_IconNotice hidden={configuredActions.length > 0}>
          No actions configured
        </R_IconNotice>
        <div id="configured-actions">
          <AnimatePresence>
            {configuredActions.map((action) => (
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
