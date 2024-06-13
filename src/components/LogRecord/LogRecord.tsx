import { motion } from "framer-motion";
import R_Icon from "../Icon/Icon";
import "./LogRecord.scss";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import useInnerSize from "../../modules/use_inner_size";
import { DEFAULT_TRANSITION_OFFSET } from "../../modules/const";

interface LogRecordProps {
  record: LogRecord;
  onConnectionNameClick: () => any;
  onRequestIdClick?: () => any;
}

export interface LogRecord extends LogRecordInitializer {
  filterString: string;
  timestamp: number;
  readableTimestamp: string;
}

export interface LogRecordInitializer {
  connectionName: string;
  response: boolean;
  incoming: boolean;
  requestId?: string;
  detail?: string;
  errorMessage?: string;
}

export default function R_LogRecord(props: LogRecordProps) {
  const arrowIconId = props.record.incoming
    ? "arrow-left-thick"
    : "arrow-right-thick";
  const secondColumn = useInnerSize((width) => width > 500);

  return (
    <motion.div
      data-timestamp={props.record.timestamp}
      layout
      initial={{ opacity: 0, x: DEFAULT_TRANSITION_OFFSET }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: DEFAULT_TRANSITION_OFFSET }}
      className="log-record-container"
    >
      <div hidden={!props.record.response} className="response">
        <R_Icon side iconId="keyboard-return" />
        In response to request&nbsp;
        <a role="button" onClick={props.onRequestIdClick}>
          {props.record.requestId}
        </a>
      </div>
      <div hidden={!props.record.errorMessage} className="error-message">
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
              {generateReadableTimestamp(props.record.timestamp)}
            </div>
            <div className="connection">
              <a role="button" onClick={props.onConnectionNameClick}>
                {props.record.connectionName}
              </a>
            </div>
            <div className="id">
              <a role="button" onClick={props.onRequestIdClick}>
                {props.record.requestId}
              </a>
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
