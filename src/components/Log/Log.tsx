import { AnimatePresence } from "framer-motion";
import R_Icon from "../Icon/Icon";
import R_LogRecord, { LogRecord } from "../LogRecord/LogRecord";
import useInnerSize from "../../modules/use_inner_size";
import "./Log.scss";
import { useMemo, useRef } from "react";
import { generateReadableTimestamp } from "../../modules/readable_timestamp";
import { useReactive } from "../../modules/reactive";
import R_BigNotice from "../BigNotice/BigNotice";

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
  const filterString = useReactive("");
  const filterType = useReactive(FilterType.All);
  const filterTimeout = useReactive(0);

  const filterInput = useRef<HTMLInputElement>(null);
  const filterTypeSelect = useRef<HTMLSelectElement>(null);

  const wideEnoughScreenForFilterIcon = useInnerSize((width) => {
    return width > 500;
  });

  function onFilterChange(value: string) {
    clearTimeout(filterTimeout.value);
    filterTimeout.value = setTimeout(() => {
      filterString.value = value;
    }, 200);
  }

  function setFilter(value: string, type: FilterType) {
    if (!filterInput.current || !filterTypeSelect.current) {
      console.error("Filter input or select not found.");
      return;
    }

    filterInput.current.value = value;
    filterTypeSelect.current.value = type;
  }

  const filteredLogRecords = useMemo(() => {
    const logRecords = props.logRecords;
    switch (filterType.value) {
      case FilterType.Timestamp:
        return logRecords.filter((record) => {
          return generateReadableTimestamp(record.timestamp).includes(
            filterString.value,
          );
        });
      case FilterType.ConnectionName:
        return logRecords.filter((record) => {
          return record.connectionName
            .toLowerCase()
            .includes(filterString.value);
        });
      case FilterType.RequestId:
        return logRecords.filter((record) => {
          return record.requestId?.toLowerCase().includes(filterString.value);
        });
      case FilterType.Detail:
        return logRecords.filter((record) => {
          return record.detail?.toLowerCase().includes(filterString.value);
        });
      case FilterType.ErrorMessage:
        return logRecords.filter((record) => {
          return record.errorMessage
            ?.toLowerCase()
            .includes(filterString.value);
        });
      case FilterType.All:
        return logRecords.filter((record) => {
          return record.filterString.includes(filterString.value);
        });
      default:
        return logRecords;
    }
  }, [filterString, filterType, props.logRecords]);

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
          onChange={(event) =>
            (filterType.value = event.target.value as FilterType)
          }
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
                key={record.timestamp}
                record={record}
              />
            );
          })}
        </AnimatePresence>
        <R_BigNotice hidden={filteredLogRecords.length > 0}>
          No logs recorded
        </R_BigNotice>
      </div>
    </>
  );
}
