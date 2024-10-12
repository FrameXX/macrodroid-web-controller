import { R_Icon } from "../Icon/Icon";
import "./LogRecord.scss";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import { R_Button } from "../Button/Button";
import { R_Accordion } from "../Accordion/Accordion";
import { useImmer } from "use-immer";
import { LogRecord, LogRecordType } from "../../modules/logger";

interface LogRecordProps {
  record: LogRecord;
  onConnectionNameClick: () => unknown;
  onRequestIdClick?: () => unknown;
  onCommentClick?: () => unknown;
  onCopyText: () => unknown;
  onCopyWebhookURL: () => unknown;
}

export function R_LogRecord(props: LogRecordProps) {
  const iconIdMap = {
    [LogRecordType.OutgoingRequest]: "arrow-right-thick",
    [LogRecordType.IncomingRequest]: "arrow-left-thick",
    [LogRecordType.Technicality]: "cog",
  } as const;
  const iconId = iconIdMap[props.record.type];
  const isTooLong = props.record.filterString.length > 340;
  const closedHeight = isTooLong ? 200 : "auto";
  const [expanded, setExpanded] = useImmer(false);

  function renderMultiLineString(string: string) {
    const lines = string.split("\n");
    return (
      <div>
        {lines.map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </div>
    );
  }

  function copyText() {
    if (!props.record.copyText) throw new Error("copyText is undefined");
    navigator.clipboard.writeText(props.record.copyText);
    props.onCopyText();
  }

  function copyURL() {
    if (!props.record.webhookURL) throw new Error("copyURL is undefined");
    navigator.clipboard.writeText(props.record.webhookURL);
    props.onCopyWebhookURL();
  }

  return (
    <div
    >
      <div hidden={!props.record.isResponse} className="response">
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
        <div className="content">
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
                  <pre className="detail">{renderMultiLineString(detail)}</pre>
                </div>
              );
            })}
          </div>
        </div>
        <div className="actions">
          <R_Button
            hidden={!isTooLong}
            onClick={() => setExpanded((prevExpaneded) => !prevExpaneded)}
            title="Expand"
            iconId="chevron-down"
            iconUpsideDown={expanded}
          />
          <R_Button
            hidden={props.record.copyText === undefined}
            onClick={copyText}
            title="Copy text"
            iconId="content-copy"
          />
          <R_Button
            hidden={props.record.webhookURL === undefined}
            onClick={copyURL}
            title="Copy webhook URL"
            iconId="link-variant"
          />
        </div>
        <div hidden={expanded || !isTooLong} className="bottom-shade" />
      </R_Accordion>
    </div>
  );
}
