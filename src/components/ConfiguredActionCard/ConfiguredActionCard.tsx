import { motion } from "framer-motion";
import R_Icon from "../Icon/Icon";
import "./ConfiguredActionCard.scss";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";
import R_Button from "../Button/Button";
import useDefaultProps from "../../modules/use_default_props";

interface ActionCardProps {
  saved?: boolean;
  name: string;
  iconId: string;
  onClick?: () => void;
}

const defaultProps: Partial<ActionCardProps> = {
  saved: false,
};

export default function R_ConfiguredActionCard(requiredProps: ActionCardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);
  const saveButtonTitle = props.saved ? "Unsave" : "Save";
  const saveButtonIcondId = props.saved ? "star" : "star-outline";

  return (
    <motion.div
      layout
      onClick={props.onClick}
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
      title={props.name}
      className="configured-action-card"
    >
      <R_Icon iconId={props.iconId} />
      <div className="name">{props.name}</div>
      <R_Button
        onClick={() => {}}
        iconId={saveButtonIcondId}
        title={saveButtonTitle}
      />
      <R_Button onClick={() => {}} title="Run" iconId="play" />
    </motion.div>
  );
}
