import { AnimatePresence, motion } from "framer-motion";
import { Action } from "../../modules/action";
import { useKey } from "../../modules/use_key";
import { R_FAB } from "../FAB/FAB";
import { R_Wizard } from "../Wizard/Wizard";
import { useColumnDeterminator } from "../../modules/use_column_determinator";
import { useRef } from "react";
import { R_CustomActionCard } from "../CustomActionCard/CustomActionCard";
import { R_IconNotice } from "../IconNotice/IconNotice";

interface CustomActionsWizardProps {
  actions: Action[];
  open: boolean;
  onClose: () => void;
  createActionWizardOpen: boolean;
  onOpenCreateActionWizard: () => void;
  onCustomActionDelete: (index: number) => void;
}

export function R_CustomActionsWizard(props: CustomActionsWizardProps) {
  const container = useRef<HTMLDivElement>(null);
  const columnCount = useColumnDeterminator(container, props.actions, 350);
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
          <motion.div animate={{ columnCount }}>
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
          </motion.div>
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
