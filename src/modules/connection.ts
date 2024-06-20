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
import { array, object, string } from "superstruct";

export const ConnectionStruct = array(
  object({
    name: string(),
    webhookId: string(),
    id: string(),
  }),
);

export class Connection {
  public listening = false;
  public lastActivityTimestamp = 0;
  private eventSource?: EventSource;

  constructor(
    public readonly name: string,
    public readonly webhookId: string,
    public readonly id: string = Random.readableId(),
  ) {}

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
    return { name: this.name, webhookId: this.webhookId, id: this.id };
  }

  private wasActive() {
    this.lastActivityTimestamp = Date.now();
  }

  public listenRequests(
    onRequest: (request: IncomingRequest) => void,
    onFailedRequest?: (errorMessage: string) => void,
    onListenFailed?: () => void,
  ) {
    if (this.listening)
      throw Error("This connection is already listening to new messages.");
    this.eventSource = new EventSource(this.ntfyTopicURL);
    this.eventSource.addEventListener("message", (event) => {
      this.wasActive();
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
    });
    if (onListenFailed)
      this.eventSource.addEventListener("error", onListenFailed);
    this.listening = true;
  }

  public stopListeningRequests() {
    if (!this.listening)
      throw Error("This connection is not listening to messages.");
    this.eventSource?.close();
    this.listening = false;
  }

  public async makeRequest(request: OutgoingRequest) {
    const URLParams = [
      { name: CONNECTION_ID_PARAM_NAME, value: this.id },
      { name: REQUEST_ID_PARAM_NAME, value: request.id.toString() },
      ...request.data,
    ];
    const URL = this.generateRequestURL(request.type, URLParams);
    const response = await fetch(URL);
    const requestLog: LogRecordInitializer = {
      connectionName: this.name,
      response: false,
      comment: request.comment,
      requestId: request.id,
      type: LogRecordType.OutgoingRequest,
    };
    if (!response.ok)
      requestLog.errorMessage = `HTTP request failed. Error ${response.status}.`;
    return requestLog;
  }
}
