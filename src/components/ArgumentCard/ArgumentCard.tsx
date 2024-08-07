import { motion } from "framer-motion";
import { ActionArgType } from "../../modules/action";
import { R_Icon } from "../Icon/Icon";
import "./ArgumentCard.scss";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";
import { R_Button } from "../Button/Button";

interface ArgumentCardProps {
  name: string;
  type: ActionArgType;
  id: string;
  onDelete: () => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
}

export function R_ArgumentCard(props: ArgumentCardProps) {
  const iconId = getIconId(props.type);

  function getIconId(type: ActionArgType) {
    switch (type) {
      case ActionArgType.String:
        return "alpha-s-box";
      case ActionArgType.MultiLineString:
        return "alpha-s-box-outline";
      case ActionArgType.Integer:
        return "alpha-i-box";
      case ActionArgType.Decimal:
        return "alpha-d-box";
      case ActionArgType.Boolean:
        return "alpha-b-box";
      case ActionArgType.Selection:
        return "alpha-i-box-outline";
      default:
        throw new TypeError("Invalid action arg type..");
    }
  }

  return (
    <motion.div
      layout
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
      className="argument-card"
    >
      <R_Icon iconId={iconId} />
      <div>
        <div className="name">{props.name}</div>
        <div className="id">{props.id}</div>
      </div>
      <R_Button title="Delete" iconId="delete" onClick={props.onDelete} />
      <R_Button
        title="Move down"
        iconId="arrow-down-thick"
        onClick={props.onMoveDown}
      />
      <R_Button
        title="Move up"
        iconId="arrow-up-thick"
        onClick={props.onMoveUp}
      />
    </motion.div>
  );
}
