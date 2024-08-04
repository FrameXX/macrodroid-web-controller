import {
  CONNECTION_ID_PARAM_NAME,
  MACRODROID_WEBHOOK_DOMAIN,
  NTFY_DOMAIN,
  NTFY_TOPIC_PREFIX,
  WEBHOOK_REQUEST_ID_PREFIX,
} from "./const";
import { Random } from "./random";
import { REQUEST_ID_PARAM_NAME } from "./const";
import {
  OutgoingRequest,
  OutgoingRequestType,
  SearchParam,
} from "./outgoing_request";
import { IncomingRequest } from "./incoming_request";
import { LogRecordInitializer, LogRecordType } from "./logger";
import { array, number, object, string } from "superstruct";

export const ConnectionsStruct = array(
  object({
    name: string(),
    webhookId: string(),
    id: string(),
    lastActivityTimestamp: number(),
  }),
);

export class Connection {
  public receiverOpened = false;
  public isListening = false;
  public lastActivityTimestamp = 0;
  private eventSource?: EventSource;
  private _removeListeners?: () => void;

  constructor(
    public readonly name: string,
    public readonly webhookId: string,
    public readonly id: string = Random.readableId(),
    lastActivityTimestamp?: number,
  ) {
    if (lastActivityTimestamp) {
      this.lastActivityTimestamp = lastActivityTimestamp;
    }
  }

  private get ntfyTopicURL() {
    return new URL(
      `https://${NTFY_DOMAIN}/${NTFY_TOPIC_PREFIX}-${this.id}/sse`,
    );
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

  public openReceiver() {
    if (this.receiverOpened) throw Error("This connection is already open.");
    this.eventSource = new EventSource(this.ntfyTopicURL);
    this.receiverOpened = true;
  }

  public closeReceiver() {
    if (!this.receiverOpened) throw Error("This connection is already closed.");
    this.eventSource?.close();
    this.receiverOpened = false;
  }

  private handleIncomingRequest(
    event: MessageEvent<any>,
    onRequest: (request: IncomingRequest) => void,
    onFailedRequest?: (errorMessage: string) => void,
  ) {
    let request: IncomingRequest | null = null;
    try {
      request = IncomingRequest.fromNtfyRequest(event.data);
    } catch (error) {
      if (onFailedRequest)
        error instanceof Error
          ? onFailedRequest(error.message)
          : onFailedRequest("Unknown error.");
    }
    if (request) onRequest(request);
  }

  public listenRequests(
    onRequest: (request: IncomingRequest) => void,
    onFailedRequest?: (errorMessage: string) => void,
    onListenFailed?: (event: Event) => void,
    onOpen?: (event: Event) => void,
  ) {
    if (!this.eventSource)
      throw new Error(
        "This connection does not have eventSource defined. It has probably not been opened.",
      );

    if (this.isListening)
      throw new Error(
        "This connection already has listeners added. Remove old listeners before adding new.",
      );

    const handleMessage = (event: MessageEvent<any>) => {
      this.handleIncomingRequest(event, onRequest, onFailedRequest);
    };

    this.eventSource.addEventListener("message", handleMessage);
    if (onListenFailed)
      this.eventSource.addEventListener("error", onListenFailed);
    if (onOpen) this.eventSource.addEventListener("open", onOpen);

    this._removeListeners = () => {
      if (!this.eventSource)
        throw new Error(
          "This connection does not have eventSource defined. It has probably not been opened.",
        );
      this.eventSource.removeEventListener("message", handleMessage);
      if (onListenFailed)
        this.eventSource.removeEventListener("error", onListenFailed);
    };

    this.isListening = true;
  }

  public removeRequestListeners() {
    if (!this._removeListeners)
      throw new Error(
        "The method to remove listeners has not been defined. Event listeners probably have not been added.",
      );
    this._removeListeners();
    this.isListening = false;
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
      response: false,
      comment: request.comment,
      requestId: request.id,
      type: LogRecordType.OutgoingRequest,
      details: request.details,
    };
    let response: Response;
    try {
      response = await fetch(URL);
    } catch (error) {
      requestLog.errorMessage =
        error instanceof Error ? error.message : "Unknown error.";
      return requestLog;
    }
    if (!response.ok)
      requestLog.errorMessage = `HTTP request failed. Error ${response.status}.`;
    return requestLog;
  }
}
