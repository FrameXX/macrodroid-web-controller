import { motion } from "framer-motion";
import { R_Icon } from "../Icon/Icon";
import "./ConfiguredActionCard.scss";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";
import { R_Button } from "../Button/Button";
import { useDefaultProps } from "../../modules/use_default_props";
import { R_Accordion } from "../Accordion/Accordion";
import { useImmer } from "use-immer";

interface ActionCardProps {
  saved?: boolean;
  name: string;
  iconId: string;
  onToggleSave: () => unknown;
  onRun: () => unknown;
  onRunWithOptions: () => unknown;
}

const defaultProps: Partial<ActionCardProps> = {
  saved: false,
};

export function R_ConfiguredActionCard(requiredProps: ActionCardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);
  const [showMoreActions, setShowMoreActions] = useImmer(false);
  const saveButtonText = props.saved ? "Unsave" : "Save";
  const saveButtonTitle = props.saved
    ? `Unsave action ${props.name}`
    : `Save action ${props.name}`;
  const saveButtonIcondId = props.saved ? "star" : "star-outline";

  return (
    <motion.div
      layout
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
      title={props.name}
      className="configured-action-card"
    >
      <div className="content">
        <R_Icon iconId={props.iconId} />
        <div className="name">{props.name}</div>
        <R_Button
          onClick={() => setShowMoreActions(!showMoreActions)}
          iconId="dots-vertical"
          title={`Show more actions for action ${props.name}`}
        />
        <R_Button
          onClick={props.onRun}
          title={`Quickly run action ${props.name}`}
          iconId="play-outline"
        />
      </div>
      <R_Accordion open={showMoreActions} className="more-actions-container">
        <div className="gap" />
        <div className="more-actions">
          <R_Button
            iconId="link-variant"
            title={`Create link to action ${props.name}`}
            text="Create link"
            onClick={() => {}}
          />
          <R_Button
            onClick={() => {
              props.onToggleSave();
              setShowMoreActions(false);
            }}
            iconId={saveButtonIcondId}
            title={saveButtonTitle}
            text={saveButtonText}
          />
          <R_Button
            onClick={() => {
              props.onRunWithOptions();
              setShowMoreActions(false);
            }}
            title={`Run action ${props.name} with options`}
            text="Run with options"
            iconId="play"
          />
        </div>
      </R_Accordion>
    </motion.div>
  );
}
