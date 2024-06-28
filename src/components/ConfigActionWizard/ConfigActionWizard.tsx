import { useImmer } from "use-immer";
import R_Wizard from "../Wizard/Wizard";
import R_FAB from "../FAB/FAB";
import { ACTIONS } from "../../modules/const";
import R_ActionCard from "../ActionCard/ActionCard";
import { AnimatePresence, Target, motion } from "framer-motion";
import "./ConfigActionWizard.scss";
import { useMemo, useRef } from "react";
import useResizeObserver from "../../modules/use_resize_observer";
import R_Icon from "../Icon/Icon";
import R_SearchInput from "../SearchInput/SearchInput";

interface ConfigActionWizardProps {
  open: boolean;
  onClose: () => void;
}

export default function R_ConfigActionWizard(props: ConfigActionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [filterValue, setFilterValue] = useImmer("");
  const actionsContainer = useRef(null);

  const secondColumn = useResizeObserver(
    actionsContainer,
    () => innerWidth > 550,
  );
  const thirdColumn = useResizeObserver(
    actionsContainer,
    () => innerWidth > 850,
  );
  const fourthColumn = useResizeObserver(
    actionsContainer,
    () => innerWidth > 1200,
  );

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

  const filteredActions = useMemo(() => {
    const filter = filterValue.toLowerCase();
    return ACTIONS.filter((action) =>
      action.name.toLowerCase().includes(filter),
    );
  }, [filterValue]);

  return (
    <R_Wizard
      open={props.open}
      pages={[
        <>
          <h2>Choose action or create a custom one.</h2>
          <div id="actions-filter">
            <R_Icon iconId="magnify" />
            <R_SearchInput
              placeholder="Filter actions"
              onSearch={setFilterValue}
            />
          </div>
          <motion.div
            ref={actionsContainer}
            id="actions"
            animate={animateActions}
          >
            <AnimatePresence>
              {filteredActions.map((action) => (
                <R_ActionCard
                  key={action.name}
                  name={action.name}
                  iconId={action.iconId}
                />
              ))}
            </AnimatePresence>
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
