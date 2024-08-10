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
import { R_Icon } from "../Icon/Icon";

interface ConnectionProps {
  listenerHealthy: boolean;
  name: string;
  id: string;
  lastActivityTimestamp: number;
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
      className="connection-card-container"
    >
      <div hidden={props.listenerHealthy} className="error-message">
        <R_Icon side iconId="alert" />
        Listener was suspended or failed.
      </div>
      <div
        className={`connection-card ${props.listenerHealthy ? "" : "listener-unhealthy"}`}
      >
        <div className="info">
          <h3 className="name">{props.name}</h3>
          <pre className="id">{props.id}</pre>
          <div className="detail">
            {generateReadableTimestamp(props.lastActivityTimestamp)}
          </div>
          <div className="detail">
            {generateReadableTimeDifference(
              Date.now() - props.lastActivityTimestamp,
            )}{" "}
            ago
          </div>
        </div>
        <R_Button
          title={`Delete ${props.name}`}
          iconId="delete-forever"
          onClick={props.onDelete}
        />
        <R_Button
          title={`Request connection confirmation of ${props.name}`}
          iconId="web-sync"
          onClick={props.onPoke}
        />
      </div>
    </motion.div>
  );
}
