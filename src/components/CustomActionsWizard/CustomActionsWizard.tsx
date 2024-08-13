import { AnimatePresence } from "framer-motion";
import { Action } from "../../modules/action";
import { useKey } from "../../modules/use_key";
import { R_FAB } from "../FAB/FAB";
import { R_Wizard } from "../Wizard/Wizard";
import { R_CustomActionCard } from "../CustomActionCard/CustomActionCard";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_MultiColList } from "../MultiColList/MultiColList";

interface CustomActionsWizardProps {
  actions: Action[];
  open: boolean;
  onClose: () => unknown;
  createActionWizardOpen: boolean;
  onOpenCreateActionWizard: () => void;
  onCustomActionDelete: (index: number) => void;
}

export function R_CustomActionsWizard(props: CustomActionsWizardProps) {
  useKey("Escape", () => {
    if (!props.createActionWizardOpen) props.onClose();
  });

  return (
    <R_Wizard
      activePageIndex={0}
      open={props.open}
      pages={[
        <>
          <h2>Custom actions</h2>
          <R_IconNotice hidden={props.actions.length > 0}>
            No custom actions configured
          </R_IconNotice>
          <R_MultiColList items={props.actions}>
            <AnimatePresence>
              {props.actions.map((action, index) => (
                <R_CustomActionCard
                  name={action.name}
                  id={action.id}
                  key={action.id}
                  onDelete={() => props.onCustomActionDelete(index)}
                />
              ))}
            </AnimatePresence>
          </R_MultiColList>
        </>,
      ]}
      rightButton={
        <R_FAB
          title="Create custom action"
          onClick={props.onOpenCreateActionWizard}
          iconId="plus"
        />
      }
      leftButton={
        <R_FAB title="Close" onClick={props.onClose} iconId="close" left />
      }
    />
  );
}
