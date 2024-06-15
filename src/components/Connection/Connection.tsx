import { Connection } from "../../modules/connection";
import "./Connection.scss";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import { generateReadableTimeDifference } from "../../modules/readable_time_difference";
import { useInterval } from "../../modules/use_interval";

interface ConnectionProps {
  connection: Connection;
}

export default function R_Connection(props: ConnectionProps) {
  useInterval(60000);

  return (
    <div className="connection">
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
  );
}
