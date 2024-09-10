import "./ConnectionCard.scss";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import { generateReadableTimeDifference } from "../../modules/readable_time_difference";
import { useUpdateInterval } from "../../modules/use_update_interval";
import { R_Button } from "../Button/Button";
import { motion, Target } from "framer-motion";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";
import { R_Icon } from "../Icon/Icon";
import { R_Accordion } from "../Accordion/Accordion";
import { useOnline } from "../../modules/use_online";

interface ConnectionProps {
  incomingServerListenerIsHealthy: boolean;
  name: string;
  id: string;
  lastActivityTimestamp: number;
  onDelete: () => void;
  onPoke: () => void;
}

export function R_Connection(props: ConnectionProps) {
  useUpdateInterval(60000);

  const online = useOnline();
  const connectionIsHealthy = online && props.incomingServerListenerIsHealthy;

  const animate: Target = connectionIsHealthy
    ? {}
    : {
        borderWidth: "var(--border-width)",
        borderColor: "var(--color-accent-trigger)",
        borderStyle: "solid",
      };

  return (
    <motion.div
      layout
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
      className="connection-card-container"
    >
      <R_Accordion open={!connectionIsHealthy} className="error-message">
        <R_Icon side iconId="alert" />
        Listener was suspended or failed.
      </R_Accordion>
      <motion.div animate={animate} className="connection-card">
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
          title={`Delete connection ${props.name}`}
          iconId="delete-forever"
          onClick={props.onDelete}
        />
        <R_Button
          title={`Request connection confirmation of ${props.name}`}
          iconId="web-sync"
          onClick={props.onPoke}
        />
      </motion.div>
    </motion.div>
  );
}
