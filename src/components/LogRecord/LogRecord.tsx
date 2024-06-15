import { TargetAndTransition, motion } from "framer-motion";
import R_Icon from "../Icon/Icon";
import "./LogRecord.scss";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import useInnerSize from "../../modules/use_inner_size";
import { DEFAULT_TRANSITION_OFFSET } from "../../modules/const";
import R_Button from "../Button/Button";
import { useReactive } from "../../modules/reactive";

export enum LogRecordType {
  OutgoingRequest,
  IncomingRequest,
  Other,
}

interface LogRecordProps {
  record: LogRecord;
  onConnectionNameClick: () => void;
  onRequestIdClick?: () => void;
}

export interface LogRecord extends LogRecordInitializer {
  filterString: string;
  timestamp: number;
  readableTimestamp: string;
}

export interface LogRecordInitializer {
  connectionName: string;
  response: boolean;
  type: LogRecordType;
  requestId?: string;
  comment?: string;
  detail?: string;
  errorMessage?: string;
}

export default function R_LogRecord(props: LogRecordProps) {
  const iconIdMap = {
    [LogRecordType.OutgoingRequest]: "arrow-right-thick",
    [LogRecordType.IncomingRequest]: "arrow-left-thick",
    [LogRecordType.Other]: "cog",
  } as const;
  const iconId = iconIdMap[props.record.type];
  const expanded = useReactive(false);
  const animate: TargetAndTransition = expanded.value ? {} : { opacity: 0 };

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
        <R_Icon side iconId={iconId} />
        <div>
          <div className="timestamp">
            {generateReadableTimestamp(props.record.timestamp)}
          </div>
          <div className="connection-name">
            <a role="button" onClick={props.onConnectionNameClick}>
              {props.record.connectionName}
            </a>
          </div>
          <div className="id">
            <a role="button" onClick={props.onRequestIdClick}>
              {props.record.requestId}
            </a>
          </div>
          <div className="comment">{props.record.comment}</div>
          <div className="detail">{props.record.detail}</div>
        </div>
        <R_Button
          onClick={() => (expanded.value = !expanded.value)}
          title="expand"
          iconId="chevron-down"
        />
      </div>
    </motion.div>
  );
}
