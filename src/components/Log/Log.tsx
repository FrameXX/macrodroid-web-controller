import { AnimatePresence } from "framer-motion";
import R_Icon from "../Icon/Icon";
import R_LogRecord, { LogRecord } from "../LogRecord/LogRecord";
import useInnerSize from "../../modules/use_inner_size";
import "./Log.scss";

interface LogProps {
  logRecords: LogRecord[];
}

export default function R_Log(props: LogProps) {
  const wideEnoughScreenForFilterIcon = useInnerSize((width) => {
    return width > 500;
  });

  return (
    <>
      <div id="log-filter">
        <R_Icon hidden={!wideEnoughScreenForFilterIcon} iconId="filter" />
        <input
          type="search"
          id="input-log-filter"
          placeholder="Filter log using..."
        />
        <select onChange={() => {}} title="Log filter">
          <option value="all">All</option>
          <option value="timestamp">Timestamp</option>
          <option value="connection_name">Conn. name</option>
          <option value="request_id">Request ID</option>
          <option value="detail">Detail</option>
          <option value="error_message">Error message</option>
        </select>
      </div>
      <div id="logs">
        <AnimatePresence>
          {props.logRecords.map((record, index) => {
            return <R_LogRecord key={index} record={record} />;
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
