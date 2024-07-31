import { motion } from "framer-motion";
import { R_Button } from "../Button/Button";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";
import "./CustomActionCard.scss";

interface CustomActionCardProps {
  name: string;
  id: string;
  onDelete: () => void;
}

export function R_CustomActionCard(props: CustomActionCardProps) {
  return (
    <motion.div
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
      id={props.id}
      className="custom-action-card"
    >
      <div>
        <div className="name">{props.name}</div>
        <div className="id">{props.id}</div>
      </div>
      <R_Button
        title={`Delete ${props.name}`}
        iconId="delete"
        onClick={props.onDelete}
      />
    </motion.div>
  );
}
