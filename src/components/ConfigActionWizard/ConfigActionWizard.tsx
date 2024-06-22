import { useImmer } from "use-immer";
import R_Wizard from "../Wizard/Wizard";
import R_FAB from "../FAB/FAB";
import { ACTIONS } from "../../modules/const";
import R_ActionCard from "../ActionCard/ActionCard";
import useInnerSize from "../../modules/use_inner_size";
import { Target, motion } from "framer-motion";
import "./ConfigActionWizard.scss";

interface ConfigActionWizardProps {
  open: boolean;
  onClose: () => void;
}

export default function R_ConfigActionWizard(props: ConfigActionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);

  const secondColumn = useInnerSize(() => innerWidth > 550);
  const thirdColumn = useInnerSize(() => innerWidth > 800);
  const fourthColumn = useInnerSize(() => innerWidth > 1100);

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

  return (
    <R_Wizard
      open={props.open}
      pages={[
        <>
          <h2>Choose action or create a custom one.</h2>
          <motion.div id="actions" animate={animateActions}>
            {ACTIONS.map((action) => (
              <R_ActionCard
                key={action.name}
                name={action.name}
                iconId={action.iconId}
              />
            ))}
          </motion.div>
        </>,
      ]}
      activePageIndex={0}
      leftButton={
        <R_FAB
          hidden={activePageIndex !== 0}
          left
          title="Cancel configuration of new action"
          onClick={props.onClose}
          iconId="close"
        />
      }
      rightButton={
        <R_FAB title="Create custom action" iconId="plus" onClick={() => {}} />
      }
    />
  );
}
