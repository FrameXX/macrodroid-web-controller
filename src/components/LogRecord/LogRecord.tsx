import { motion } from "framer-motion";
import { R_Icon } from "../Icon/Icon";
import "./LogRecord.scss";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import { DEFAULT_TRANSITION_OFFSET } from "../../modules/const";
import { R_Button } from "../Button/Button";
import { R_Accordion } from "../Accordion/Accordion";
import { useImmer } from "use-immer";
import { LogRecord, LogRecordType } from "../../modules/logger";

interface LogRecordProps {
  record: LogRecord;
  onConnectionNameClick: () => void;
  onRequestIdClick?: () => void;
  onCommentClick?: () => void;
}

export function R_LogRecord(props: LogRecordProps) {
  const iconIdMap = {
    [LogRecordType.OutgoingRequest]: "arrow-right-thick",
    [LogRecordType.IncomingRequest]: "arrow-left-thick",
    [LogRecordType.Technicality]: "cog",
  } as const;
  const iconId = iconIdMap[props.record.type];
  const isTooLong = props.record.filterString.length > 340;
  const closedHeight = isTooLong ? 150 : "auto";
  const [expanded, setExpanded] = useImmer(false);

  return (
    <motion.div
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
      <R_Accordion
        open={expanded}
        closedHeight={closedHeight}
        className={`log-record ${props.record.errorMessage ? "failed" : ""}`}
      >
        <R_Icon iconId={iconId} />
        <div>
          <div className="comment">
            <a role="button" onClick={props.onCommentClick}>
              {props.record.comment}
            </a>
          </div>
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
          <div className="details">
            {props.record.details?.map((detail, index) => {
              return (
                <div key={index}>
                  <hr />
                  {detail}
                </div>
              );
            })}
          </div>
        </div>
        <R_Button
          hidden={!isTooLong}
          onClick={() => setExpanded((prevExpaneded) => !prevExpaneded)}
          title="Expand"
          iconId="chevron-down"
          iconUpsideDown={expanded}
        />
        <div hidden={expanded || !isTooLong} className="bottom-shade" />
      </R_Accordion>
    </motion.div>
  );
}
