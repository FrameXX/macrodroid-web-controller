import { motion } from "framer-motion";
import R_Icon from "../Icon/Icon";
import "./ActionCard.scss";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";

interface ActionCardProps {
  name: string;
  iconId: string;
  onClick?: () => void;
}

export default function R_ActionCard(props: ActionCardProps) {
  return (
    <motion.button
      layout
      onClick={props.onClick}
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
      type="button"
      title={props.name}
      className="action-card"
    >
      <R_Icon iconId={props.iconId} />
      {props.name}
    </motion.button>
  );
}
