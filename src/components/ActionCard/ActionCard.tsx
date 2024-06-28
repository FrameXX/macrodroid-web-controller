import { Target, motion } from "framer-motion";
import R_Icon from "../Icon/Icon";
import "./ActionCard.scss";
import { DEFAULT_TRANSITION_UNMOUNTED_SCALE } from "../../modules/const";

interface ActionCardProps {
  name: string;
  iconId: string;
}

export default function R_ActionCard(props: ActionCardProps) {
  const animateUnmounted: Target = {
    opacity: 0,
    transform: `scale(${DEFAULT_TRANSITION_UNMOUNTED_SCALE})`,
  };
  const animateMounted: Target = {
    opacity: 1,
    transform: "scale(1)",
  };

  return (
    <motion.button
      layout
      initial={animateUnmounted}
      animate={animateMounted}
      exit={animateUnmounted}
      type="button"
      title={props.name}
      className="action-card"
    >
      <R_Icon iconId={props.iconId} />
      {props.name}
    </motion.button>
  );
}
