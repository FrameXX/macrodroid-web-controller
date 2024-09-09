import {
  CONNECTION_ID_PARAM_NAME,
  MACRODROID_WEBHOOK_DOMAIN,
  WEBHOOK_REQUEST_ID_PREFIX,
} from "./const";
import { Random } from "./random";
import { REQUEST_ID_PARAM_NAME } from "./const";
import {
  OutgoingRequest,
  OutgoingRequestType,
  SearchParam,
} from "./outgoing_request";
import { LogRecordInitializer, LogRecordType } from "./logger";
import { array, number, object, string } from "superstruct";
import { stringifyError } from "./misc";
import { NtfyIncomingServer } from "./ntfy_incoming_server";
import { IncomingServer } from "./incoming_server";

export const ConnectionsStruct = array(
  object({
    name: string(),
    webhookId: string(),
    id: string(),
    lastActivityTimestamp: number(),
  }),
);

export class Connection {
  public isListening = false;
  public lastActivityTimestamp = 0;
  public incomingServer: IncomingServer;

  constructor(
    public readonly name: string,
    public readonly webhookId: string,
    public readonly id: string = Random.readableId(),
    lastActivityTimestamp?: number,
  ) {
    this.incomingServer = new NtfyIncomingServer(this.id);
    if (lastActivityTimestamp) {
      this.lastActivityTimestamp = lastActivityTimestamp;
    }
  }

  public generateRequestURL(
    requestType: OutgoingRequestType,
    params?: SearchParam[],
  ) {
    const webhookURL = new URL(
      `https://${MACRODROID_WEBHOOK_DOMAIN}/${this.webhookId}/${WEBHOOK_REQUEST_ID_PREFIX}-${requestType}`,
    );
    if (!params) return webhookURL;
    for (const param of params) {
      webhookURL.searchParams.append(param.name, param.value);
    }
    return webhookURL;
  }

  public get rawObject() {
    return {
      name: this.name,
      webhookId: this.webhookId,
      id: this.id,
      lastActivityTimestamp: this.lastActivityTimestamp,
    };
  }

  public async makeRequest(request: OutgoingRequest) {
    const URLParams = [
      { name: CONNECTION_ID_PARAM_NAME, value: this.id },
      { name: REQUEST_ID_PARAM_NAME, value: request.id.toString() },
      ...request.data,
    ];
    const URL = this.generateRequestURL(request.type, URLParams);
    const requestLog: LogRecordInitializer = {
      connectionName: this.name,
      isResponse: request.type === OutgoingRequestType.Confirm,
      comment: request.comment,
      requestId: request.id,
      type: LogRecordType.OutgoingRequest,
      details: request.details,
      webhookURL: URL.toString(),
    };
    let response: Response;
    try {
      response = await fetch(URL);
    } catch (error) {
      requestLog.errorMessage = stringifyError(error);
      return requestLog;
    }
    if (!response.ok)
      requestLog.errorMessage = `HTTP request failed. Error ${response.status}.`;
    return requestLog;
  }
}
