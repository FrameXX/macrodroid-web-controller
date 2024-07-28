import { motion } from "framer-motion";
import { R_Button } from "../Button/Button";
import "./SelectOptionCard.scss";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";

interface SelectOptionCardProps {
  index: number;
  title: string;
  onDelete: () => void;
  onChange: (newValue: string, validity: boolean) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function R_SelectOptionCard(props: SelectOptionCardProps) {
  return (
    <motion.div
      layout
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
      className="select-option-card"
    >
      <div>
        <div className="index">{props.index}</div>
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
      </div>
      <input
        required
        placeholder="Option title"
        onChange={(event) =>
          props.onChange(event.target.value, event.target.validity.valid)
        }
        type="text"
      />
    </motion.div>
  );
}
