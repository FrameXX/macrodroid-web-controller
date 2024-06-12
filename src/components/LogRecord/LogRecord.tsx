import { motion } from "framer-motion";
import R_Icon from "../Icon/Icon";
import "./LogRecord.scss";
import { readableTimestamp } from "../../modules/readable_timestamp";
import useInnerSize from "../../modules/use_inner_size";

interface LogRecordProps {
  record: LogRecord;
}

export interface LogRecord {
  connectionName: string;
  timestamp: number;
  response: boolean;
  incoming: boolean;
  id?: string;
  detail?: string;
  errorMessage?: string;
}

export type LogRecordInitializer = Omit<LogRecord, "timestamp">;

export default function R_LogRecord(props: LogRecordProps) {
  const arrowIconId = props.record.incoming
    ? "arrow-left-thick"
    : "arrow-right-thick";
  const secondColumn = useInnerSize((width) => width > 500);

  return (
    <motion.div className="log-record-container">
      <div hidden={!props.record.response} className="response">
        <R_Icon side iconId="keyboard-return" />
        In response to request&nbsp;<a role="button">{props.record.id}</a>
      </div>
      <div hidden={!props.record.errorMessage} className="error-message">
        {" "}
        <R_Icon side iconId="alert" />
        {props.record.errorMessage}
      </div>
      <div
        className={`log-record ${props.record.errorMessage ? "failed" : ""}`}
      >
        <R_Icon side iconId={arrowIconId} />
        <div>
          <div>
            <div className="timestamp">
              {readableTimestamp(props.record.timestamp)}
            </div>
            <div className="connection">
              <a role="button">{props.record.connectionName}</a>
            </div>
            <div className="id">
              <a role="button">{props.record.id}</a>
            </div>
            <div hidden={secondColumn} className="detail">
              {props.record.detail}
            </div>
          </div>
          <div hidden={!secondColumn} className="side detail">
            {props.record.detail}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
