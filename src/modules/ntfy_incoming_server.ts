import { NTFY_DOMAIN, NTFY_TOPIC_PREFIX } from "./const";
import { IncomingRequest } from "./incoming_request";
import { IncomingServer } from "./incoming_server";
import { stringifyError } from "./misc";

export class NtfyIncomingServer extends IncomingServer {
  private eventSource: EventSource;
  private handleRequestListenerRemoval?: () => unknown;
  private ntfyTopicSSE: string;

  constructor(connectionId: string) {
    super(connectionId);
    this.ntfyTopicSSE = `https://${NTFY_DOMAIN}/${NTFY_TOPIC_PREFIX}-${this.connectionId}/sse`;
    this.eventSource = new EventSource(this.ntfyTopicSSE);
  }

  private handleIncomingMessage(
    event: MessageEvent<string>,
    onRequest: (request: IncomingRequest) => void,
    onFailedRequest?: (errorMessage: string) => void,
  ) {
    let parsedMessage: object;
    try {
      parsedMessage = JSON.parse(event.data) as object;
    } catch (error) {
      if (onFailedRequest)
        onFailedRequest(
          stringifyError(error, "Failed to parse incoming request."),
        );
      return;
    }

    if (!("message" in parsedMessage)) {
      if (onFailedRequest)
        onFailedRequest(
          "Parsed incoming message is missing the message property.",
        );
      return;
    }
    if (typeof parsedMessage.message !== "string") {
      if (onFailedRequest)
        onFailedRequest(
          "Parsed incoming message's message property is not a string.",
        );
      return;
    }

    let request: IncomingRequest | null = null;
    try {
      request = IncomingRequest.fromString(parsedMessage.message);
    } catch (error) {
      if (onFailedRequest) onFailedRequest(stringifyError(error));
    }
    if (request) onRequest(request);
  }

  public closeConnection() {
    this.eventSource?.close();
  }

  public onListenRequests(
    onRequest: (request: IncomingRequest) => void,
    onFailedRequest?: (errorMessage: string) => void,
    onListenFailed?: (event: Event) => void,
    onOpen?: (event: Event) => void,
  ) {
    if (this.isListening)
      throw new Error(
        "This connection already has listeners added. Remove old listeners before adding new.",
      );

    const handleMessage = (event: MessageEvent<string>) => {
      this.handleIncomingMessage(event, onRequest, onFailedRequest);
    };

    this.eventSource.addEventListener("message", handleMessage);
    if (onListenFailed)
      this.eventSource.addEventListener("error", onListenFailed);
    if (onOpen) this.eventSource.addEventListener("open", onOpen);

    this.handleRequestListenerRemoval = () => {
      if (!this.eventSource)
        throw new Error(
          "This connection does not have eventSource defined. It has probably not been opened.",
        );
      this.eventSource.removeEventListener("message", handleMessage);
      if (onListenFailed)
        this.eventSource.removeEventListener("error", onListenFailed);
    };
  }

  public onRemoveRequestListener() {
    if (!this.handleRequestListenerRemoval)
      throw new Error(
        "The method to remove listener has not been defined. Event listener probably have not been ever added.",
      );
    this.handleRequestListenerRemoval();
  }
}
