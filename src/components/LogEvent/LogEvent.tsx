import R_Icon from "../Icon/Icon";
import "./LogEvent.scss";

interface LogEventProps {}

export default function R_LogEvent(props: LogEventProps) {
  return (
    <div className="log-event">
      <div>
        <R_Icon side iconId={"clock"} />
        2024-06-24 12:25:43
      </div>
      <div>
        <R_Icon side iconId={"arrow-right-thick"} />
        Mi Box
      </div>
      <div>
        <R_Icon side iconId={"play"} />
        Confirm connection
      </div>
      <div>
        <R_Icon side iconId={"identifier"} />
        2442
      </div>
      <div className="error">
        <R_Icon side iconId={"alert"} />
        Device not found and extra long text that should be truncated even
        though it won't.
      </div>
    </div>
  );
}
