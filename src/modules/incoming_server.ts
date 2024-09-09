import { IncomingRequest } from "./incoming_request";

export abstract class IncomingServer {
  public listenerIsHealthy: boolean = true;
  public isListening = false;

  constructor(protected readonly connectionId: string) {}

  public listenRequests(
    onRequest: (request: IncomingRequest) => void,
    onFailedRequest?: (errorMessage: string) => void,
    onListenFailed?: (event: Event) => void,
    onOpen?: (event: Event) => void,
  ): void {
    if (this.isListening)
      throw new Error(
        "This connection already has listeners added. Remove old listeners before adding new.",
      );
    this.onListenRequests(onRequest, onFailedRequest, onListenFailed, onOpen);
    this.isListening = true;
  }

  public removeRequestListener() {
    if (!this.isListening)
      throw new Error("This connection has no listeners to remove.");
    this.onRemoveRequestListener();
    this.isListening = false;
  }

  public abstract closeConnection(): unknown;

  protected abstract onListenRequests(
    onRequest: (request: IncomingRequest) => void,
    onFailedRequest?: (errorMessage: string) => void,
    onListenFailed?: (event: Event) => void,
    onOpen?: (event: Event) => void,
  ): unknown;

  protected abstract onRemoveRequestListener(): unknown;
}
