import { Updater } from "use-immer";
import { generateReadableTimestamp } from "./readable_timestamp";
import { Random } from "./random";

export enum LogRecordType {
  OutgoingRequest,
  IncomingRequest,
  Technicality,
}

export interface LogRecord extends LogRecordInitializer {
  filterString: string;
  timestamp: number;
  readableTimestamp: string;
  id: number;
}

export interface LogRecordInitializer {
  connectionName: string;
  response: boolean;
  type: LogRecordType;
  requestId?: string;
  comment?: string;
  details?: string[];
  errorMessage?: string;
}

export class Logger {
  constructor(private readonly setLogRecords: Updater<LogRecord[]>) {}

  private generateFilterString(
    logRecordInitializer: LogRecordInitializer,
    readableTimestamp: string,
  ) {
    return (
      readableTimestamp +
      logRecordInitializer.connectionName.toLowerCase() +
      logRecordInitializer.requestId?.toLowerCase() +
      logRecordInitializer.comment?.toLowerCase() +
      logRecordInitializer.details?.join("").toLowerCase() +
      logRecordInitializer.errorMessage?.toLowerCase()
    );
  }

  public log(record: LogRecordInitializer) {
    const timestamp = Date.now();
    const readableTimestamp = generateReadableTimestamp(timestamp);
    const filterString = this.generateFilterString(record, readableTimestamp);
    const id = Random.id();
    const logRecord: LogRecord = {
      ...record,
      timestamp,
      readableTimestamp,
      filterString,
      id,
    };
    this.setLogRecords((prevLogRecords) => {
      prevLogRecords.unshift(logRecord);
      return prevLogRecords;
    });
  }
}
