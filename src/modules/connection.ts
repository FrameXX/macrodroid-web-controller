import {
  connectionIdParamName,
  macrodroidWebhookDomain,
  ntfyDomain,
  ntfyTopicPrefix,
  webhookRequestIdPrefix,
} from "./const";
import { Random } from "./random";
import { requestIdParamName } from "./const";

export type RequestType = "add";

export interface SearchParam {
  name: string;
  value: string;
}

export class Connection {
  public readonly id: string;
  public readonly listening = false;
  private eventSource?: EventSource;

  constructor(
    public readonly name: string,
    public readonly webhookId: string,
  ) {
    this.id = Random.readableId();
  }

  private get ntfyTopicURL() {
    return new URL(`https://${ntfyDomain}/${ntfyTopicPrefix}-${this.id}/sse`);
  }

  public listen(
    onMessage: (event: MessageEvent) => any,
    onError?: (event: Event) => any,
    onOpen?: (event: Event) => any,
  ) {
    if (this.listening)
      throw Error("This connection is already listening to new messages");
    this.eventSource = new EventSource(this.ntfyTopicURL);
    this.eventSource.addEventListener("message", (event) => onMessage(event));
    if (onError)
      this.eventSource.addEventListener("error", (event) => onError(event));
    if (onOpen)
      this.eventSource.addEventListener("open", (event) => onOpen(event));
  }

  public webhookURL(requestType: RequestType, params?: SearchParam[]) {
    const webhookURL = new URL(
      `https://${macrodroidWebhookDomain}/${this.webhookId}/${webhookRequestIdPrefix}-${requestType}`,
    );
    if (!params) return webhookURL;
    for (const param of params) {
      webhookURL.searchParams.append(param.name, param.value);
    }
    return webhookURL;
  }

  public request(
    type: RequestType,
    extraData: SearchParam[],
    onError?: (statusText: string) => any,
  ) {
    const requestId = Random.id(4);
    const webhookURL = this.webhookURL(type, [
      { name: connectionIdParamName, value: this.id },
      { name: requestIdParamName, value: requestId.toString() },
      ...extraData,
    ]);
    fetch(webhookURL).then((response) => {
      if (!response.ok && onError) onError(response.statusText);
    });
    return requestId;
  }
}
