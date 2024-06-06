import {
  CONNECTION_ID_PARAM_NAME,
  MACRODROID_WEBHOOK_DOMAIN,
  NTFY_DOMAIN,
  NTFY_TOPIC_PREFIX,
  WEBHOOK_REQUEST_ID_PREFIX,
} from "./const";
import { Random } from "./random";
import { REQUEST_ID_PARAM_NAME } from "./const";

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
    return new URL(
      `https://${NTFY_DOMAIN}/${NTFY_TOPIC_PREFIX}-${this.id}/sse`,
    );
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
      `https://${MACRODROID_WEBHOOK_DOMAIN}/${this.webhookId}/${WEBHOOK_REQUEST_ID_PREFIX}-${requestType}`,
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
    onError?: (satus: number) => any,
    onSuccess?: () => any,
  ) {
    const requestId = Random.id(4);
    const webhookURL = this.webhookURL(type, [
      { name: CONNECTION_ID_PARAM_NAME, value: this.id },
      { name: REQUEST_ID_PARAM_NAME, value: requestId.toString() },
      ...extraData,
    ]);
    fetch(webhookURL).then((response) => {
      if (!response.ok && onError) onError(response.status);
      if (response.ok && onSuccess) onSuccess();
    });
    return requestId;
  }
}
