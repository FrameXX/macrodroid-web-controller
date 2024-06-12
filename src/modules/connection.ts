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
  OutGoingRequestStatus,
  OutgoingRequest,
  OutgoingRequestType,
  SearchParam,
} from "./outgoing_request";
import { IncomingRequest } from "./incoming_request";

export class Connection {
  public readonly id: string;
  public listening = false;
  private eventSource?: EventSource;

  constructor(
    public readonly name: string,
    public readonly webhookId: string,
  ) {
    this.id = Random.readableId();
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

  public listenRequests(
    onRequest: (request: IncomingRequest) => any,
    onFailedRequest?: (errorMessage: string) => any,
  ) {
    if (this.listening)
      throw Error("This connection is already listening to new messages.");
    this.eventSource = new EventSource(this.ntfyTopicURL);
    this.eventSource.addEventListener("message", (event) => {
      try {
        const request = IncomingRequest.fromString(event.data);
        onRequest(request);
      } catch (error) {
        if (onFailedRequest)
          error instanceof Error
            ? onFailedRequest(error.message)
            : onFailedRequest("Unknown error.");
      }
    });
  }

  public stopListeningRequests() {
    if (!this.listening)
      throw Error("This connection is not listening to new messages.");
    this.eventSource?.close();
    this.listening = false;
  }

  public async requestAddConnection(onIdAssigned: (id: string) => any) {
    const request = new OutgoingRequest(
      OutgoingRequestType.Add,
      [],
      "Reuqest connection confirmation for the connection to be added.",
    );
    onIdAssigned(request.id);
    const response = await this.makeRequest(request);
    response.ok
      ? request.success()
      : request.fail(`HTTP request failed. Error ${response.status}`);
    return request;
  }

  public async makeRequest(request: OutgoingRequest) {
    if (request.status !== OutGoingRequestStatus.NotSend)
      throw new Error("Resending requests is not allowed.");
    const URLParams = [
      { name: CONNECTION_ID_PARAM_NAME, value: this.id },
      { name: REQUEST_ID_PARAM_NAME, value: request.id.toString() },
      ...request.data,
    ];
    const URL = this.generateRequestURL(request.type, URLParams);
    return await fetch(URL);
  }
}
