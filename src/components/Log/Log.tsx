import { AnimatePresence } from "framer-motion";
import R_Icon from "../Icon/Icon";
import R_LogRecord, { LogRecord } from "../LogRecord/LogRecord";
import useInnerSize from "../../modules/use_inner_size";
import "./Log.scss";
import { useRef, useState } from "react";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";

interface LogProps {
  logRecords: LogRecord[];
}

enum FilterType {
  All = "all",
  Timestamp = "timestamp",
  ConnectionName = "connection_name",
  RequestId = "request_id",
  Detail = "detail",
  ErrorMessage = "error_message",
}

export default function R_Log(props: LogProps) {
  const [filterString, setFilterString] = useState("");
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [filterTimeout, setFilterTimeout] = useState(0);

  const filterInput = useRef<HTMLInputElement>(null);
  const filterTypeSelect = useRef<HTMLSelectElement>(null);

  const wideEnoughScreenForFilterIcon = useInnerSize((width) => {
    return width > 500;
  });

  function onFilterChange(value: string) {
    clearTimeout(filterTimeout);
    setFilterTimeout(
      setTimeout(() => {
        setFilterString(value);
      }, 200),
    );
  }

  function filterLogRecords(logRecords: LogRecord[]) {
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
      case FilterType.Detail:
        return logRecords.filter((record) => {
          return record.detail?.toLowerCase().includes(filterString);
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
  }

  function setFilter(value: string, type: FilterType) {
    if (!filterInput.current || !filterTypeSelect.current) {
      console.error("Filter input or select not found.");
      return;
    }

    filterInput.current.value = value;
    filterTypeSelect.current.value = type;
  }

  console.log(filterLogRecords(props.logRecords));

  return (
    <>
      <div id="log-filter">
        <R_Icon hidden={!wideEnoughScreenForFilterIcon} iconId="filter" />
        <input
          ref={filterInput}
          onChange={(event) => onFilterChange(event.target.value.toLowerCase())}
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
          <option value="detail">Detail</option>
          <option value="error_message">Error message</option>
        </select>
      </div>
      <div id="logs">
        <AnimatePresence initial={false}>
          {filterLogRecords(props.logRecords).map((record) => {
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
                key={record.timestamp}
                record={record}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
