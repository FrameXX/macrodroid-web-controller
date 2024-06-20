import { AnimatePresence } from "framer-motion";
import R_Icon from "../Icon/Icon";
import R_LogRecord from "../LogRecord/LogRecord";
import useInnerSize from "../../modules/use_inner_size";
import "./Log.scss";
import { useMemo, useRef } from "react";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import R_IconNotice from "../IconNotice/IconNotice";
import R_FAB from "../FAB/FAB";
import { useImmer } from "use-immer";
import { LogRecord } from "../../modules/logger";
import R_Button from "../Button/Button";
import { Confirm } from "../../modules/confirmDialog";

interface LogProps {
  logRecords: LogRecord[];
  containerScrollPx: number;
  onScrollUp: () => void;
  clearLog: () => void;
  confirm: Confirm;
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

export default function R_Log(props: LogProps) {
  const [filterString, setFilterString] = useImmer("");
  const [filterType, setFilterType] = useImmer(FilterType.All);

  const filterInput = useRef<HTMLInputElement>(null);
  const filterTypeSelect = useRef<HTMLSelectElement>(null);
  const filterTimeout = useRef(0);

  const wideEnoughScreenForFilterIcon = useInnerSize(() => {
    return innerWidth > 500;
  });

  function onFilterChange(value: string) {
    clearTimeout(filterTimeout.current);
    filterTimeout.current = setTimeout(() => {
      setFilterString(value.toLowerCase());
    }, 200);
  }

  function setFilter(value: string, type: FilterType) {
    if (!filterInput.current || !filterTypeSelect.current) {
      console.error("Filter input or select not found.");
      return;
    }

    filterInput.current.value = value;
    filterTypeSelect.current.value = type;
    onFilterChange(value);
  }

  const scrolledDown = props.containerScrollPx > innerHeight * 0.5;

  const filteredLogRecords = useMemo(() => {
    const logRecords = props.logRecords;
    switch (filterType) {
      case FilterType.Timestamp:
        return logRecords.filter((record) => {
          return generateReadableTimestamp(record.timestamp).includes(
            filterString,
          );
        });
      case FilterType.ConnectionName:
        return logRecords.filter((record) => {
          return record.connectionName.toLowerCase().includes(filterString);
        });
      case FilterType.RequestId:
        return logRecords.filter((record) => {
          return record.requestId?.toLowerCase().includes(filterString);
        });
      case FilterType.Comment:
        return logRecords.filter((record) => {
          return record.comment?.toLowerCase().includes(filterString);
        });
      case FilterType.Details:
        return logRecords.filter((record) => {
          return record.details?.join("").toLowerCase().includes(filterString);
        });
      case FilterType.ErrorMessage:
        return logRecords.filter((record) => {
          return record.errorMessage?.toLowerCase().includes(filterString);
        });
      case FilterType.All:
        return logRecords.filter((record) => {
          return record.filterString.includes(filterString);
        });
      default:
        return logRecords;
    }
  }, [filterString, filterType, props.logRecords]);

  async function clearLog() {
    if (
      await props.confirm("Are you sure? This will delete all log entries.")
    ) {
      props.clearLog();
    }
  }

  return (
    <>
      <div id="log-filter">
        <R_Icon side hidden={!wideEnoughScreenForFilterIcon} iconId="filter" />
        <input
          ref={filterInput}
          onChange={(event) => onFilterChange(event.target.value)}
          type="search"
          id="input-log-filter"
          placeholder="Filter log using..."
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
          <option value="error_message">Error message</option>
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
      <R_IconNotice hidden={props.logRecords.length > 0}>
        No logs recorded
      </R_IconNotice>
      <R_IconNotice
        iconId="filter-remove"
        hidden={props.logRecords.length === 0 || filteredLogRecords.length > 0}
      >
        All logs have been filtered out.
      </R_IconNotice>
      <div id="logs">
        <AnimatePresence initial={false}>
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
              />
            );
          })}
        </AnimatePresence>
        <div className="fab-placeholder" />
      </div>
      <R_FAB
        hidden={!scrolledDown}
        title="Scroll up"
        onClick={props.onScrollUp}
        iconId="arrow-up"
      />
    </>
  );
}
