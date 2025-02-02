import { R_Icon } from "../Icon/Icon";
import { R_LogRecord } from "../LogRecord/LogRecord";
import { useInnerSize } from "../../modules/use_inner_size";
import "./Log.scss";
import { useMemo, useRef } from "react";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_FAB } from "../FAB/FAB";
import { useImmer } from "use-immer";
import { LogRecord } from "../../modules/logger";
import { R_Button } from "../Button/Button";
import { Confirm } from "../../modules/confirm_dialog";
import { R_SearchInput } from "../SearchInput/SearchInput";
import { BakeToast } from "../../modules/toaster";
import { useKey } from "../../modules/use_key";

interface LogProps {
  logRecords: LogRecord[];
  scrolledDown: boolean;
  onScrollUp: () => void;
  clearLog: () => void;
  confirm: Confirm;
  bakeToast: BakeToast;
}

enum FilterType {
  All = "all",
  Timestamp = "timestamp",
  ConnectionName = "connection_name",
  RequestId = "request_id",
  Comment = "comment",
  Details = "details",
  ErrorMessage = "error_message",
}

export function R_Log(props: LogProps) {
  const [filterValue, setFilterValue] = useImmer("");
  const [filterType, setFilterType] = useImmer(FilterType.All);

  const filterValueInput = useRef<HTMLInputElement>(null);
  const filterTypeSelect = useRef<HTMLSelectElement>(null);

  const wideEnoughScreenForFilterIcon = useInnerSize(() => {
    return innerWidth > 500;
  });

  useKey("/", () => {
    filterValueInput.current?.focus();
  });

  function setFilter(value: string, type: FilterType) {
    if (!filterValueInput.current || !filterTypeSelect.current) {
      console.error("Filter input or select not found.");
      return;
    }

    filterValueInput.current.value = value;
    filterTypeSelect.current.value = type;
    setFilterType(type);
    setFilterValue(value);
  }

  const filteredLogRecords = useMemo(() => {
    const logRecords = props.logRecords;
    const filter = filterValue.toLowerCase();
    switch (filterType) {
      case FilterType.Timestamp:
        return logRecords.filter((record) => {
          return generateReadableTimestamp(record.timestamp).includes(filter);
        });
      case FilterType.ConnectionName:
        return logRecords.filter((record) => {
          return record.connectionName.toLowerCase().includes(filter);
        });
      case FilterType.RequestId:
        return logRecords.filter((record) => {
          return record.requestId?.toLowerCase().includes(filter);
        });
      case FilterType.Comment:
        return logRecords.filter((record) => {
          return record.comment?.toLowerCase().includes(filter);
        });
      case FilterType.Details:
        return logRecords.filter((record) => {
          return record.details?.join("").toLowerCase().includes(filter);
        });
      case FilterType.ErrorMessage:
        return logRecords.filter((record) => {
          return record.errorMessage?.toLowerCase().includes(filter);
        });
      case FilterType.All:
        return logRecords.filter((record) => {
          return record.filterString.includes(filter);
        });
      default:
        return logRecords;
    }
  }, [filterValue, filterType, props.logRecords]);

  async function clearLog() {
    if (
      await props.confirm("Are you sure? This will delete all log entries.")
    ) {
      props.clearLog();
    }
  }

  return (
    <>
      <div className="sticky-filter">
        <R_Icon side hidden={!wideEnoughScreenForFilterIcon} iconId="filter" />
        <R_SearchInput
          ref={filterValueInput}
          onSearch={setFilterValue}
          placeholder='Filter log (type "/" to focus)'
        />
        <select
          ref={filterTypeSelect}
          onChange={(event) => setFilterType(event.target.value as FilterType)}
          title="Log filter"
        >
          <option value="all">All</option>
          <option value="timestamp">Timestamp</option>
          <option value="connection_name">Conn. name</option>
          <option value="request_id">Request ID</option>
          <option value="comment">Comment</option>
          <option value="details">Details</option>
          <option value="error_message">Error</option>
        </select>
      </div>
      <R_Button
        hidden={props.logRecords.length === 0}
        id="clear-log-button"
        title="Clear log"
        text="Clear log"
        onClick={clearLog}
        iconId="delete"
      />
      <R_IconNotice
        title="No logs recorded"
        hidden={props.logRecords.length > 0}
      />
      <R_IconNotice
        title="All logs have been filtered out."
        iconId="filter-remove"
        hidden={props.logRecords.length === 0 || filteredLogRecords.length > 0}
      />
      <div id="logs">
        {filteredLogRecords.map((record) => {
          return (
            <R_LogRecord
              onConnectionNameClick={() => {
                setFilter(
                  record.connectionName ?? "",
                  FilterType.ConnectionName,
                );
              }}
              onRequestIdClick={() => {
                setFilter(record.requestId ?? "", FilterType.RequestId);
              }}
              onCommentClick={() => {
                setFilter(record.comment ?? "", FilterType.Comment);
              }}
              key={record.id}
              record={record}
              onCopyText={() =>
                props.bakeToast({
                  message: "Text copied.",
                  iconId: "content-copy",
                })
              }
              onCopyWebhookURL={() =>
                props.bakeToast({
                  message: "Webhook URL copied.",
                  iconId: "content-copy",
                })
              }
            />
          );
        })}
        <div className="fab-placeholder" />
      </div>
      <R_FAB
        hidden={!props.scrolledDown}
        title="Scroll up"
        onClick={props.onScrollUp}
        iconId="arrow-up-thick"
      />
    </>
  );
}
