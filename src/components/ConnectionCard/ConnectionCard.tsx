import { Connection } from "../../modules/connection";
import "./ConnectionCard.scss";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import { generateReadableTimeDifference } from "../../modules/readable_time_difference";
import { useUpdateInterval } from "../../modules/use_update_interval";
import R_Button from "../Button/Button";
import { Target, motion } from "framer-motion";
import { DEFAULT_TRANSITION_UNMOUNTED_SCALE } from "../../modules/const";

interface ConnectionProps {
  connection: Connection;
  onDelete: () => void;
  onPoke: () => void;
}

export default function R_Connection(props: ConnectionProps) {
  useUpdateInterval(60000);
  const animateUnmounted: Target = {
    opacity: 0,
    transform: `scale(${DEFAULT_TRANSITION_UNMOUNTED_SCALE})`,
  };
  const animateMounted: Target = {
    opacity: 1,
    transform: "scale(1)",
  };

  return (
    <motion.div
      layout
      initial={animateUnmounted}
      animate={animateMounted}
      exit={animateUnmounted}
      className="connection-card"
    >
      <div className="info">
        <div className="name">{props.connection.name}</div>
        <div className="last-activity">
          {generateReadableTimestamp(props.connection.lastActivityTimestamp)}
        </div>
        <div className="last-activity-difference">
          {generateReadableTimeDifference(
            Date.now() - props.connection.lastActivityTimestamp,
          )}{" "}
          ago
        </div>
      </div>
      <div className="actions">
        <R_Button
          title="Delete"
          iconId="delete-forever"
          onClick={props.onDelete}
        />
        <R_Button title="Poke" iconId="web-sync" onClick={props.onPoke} />
      </div>
    </motion.div>
  );
}
