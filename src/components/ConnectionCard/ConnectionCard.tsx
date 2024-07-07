import { Connection } from "../../modules/connection";
import "./ConnectionCard.scss";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import { generateReadableTimeDifference } from "../../modules/readable_time_difference";
import { useUpdateInterval } from "../../modules/use_update_interval";
import { R_Button } from "../Button/Button";
import { motion } from "framer-motion";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";

interface ConnectionProps {
  connection: Connection;
  onDelete: () => void;
  onPoke: () => void;
}

export function R_Connection(props: ConnectionProps) {
  useUpdateInterval(60000);

  return (
    <motion.div
      layout
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
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
