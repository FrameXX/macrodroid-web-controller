import { array, assert, Infer, number, object, string } from "superstruct";

export enum IncomingRequestType {
  Response,
  Confirmation,
  Notification,
  TextShare,
}

const IncomingRequestStruct = object({
  id: string(),
  type: number(),
  details: array(string()),
});

export class IncomingRequest {
  public static textShareRequireConfirmIndex = 0;
  public static notificationRequireConfirmIndex = 0;
  public static textShareTextIndex = 1;
  public static notificationTitleIndex = 1;
  public static notificationBodyIndex = 2;

  constructor(
    public readonly id: string,
    public readonly type: IncomingRequestType,
    public readonly details: string[],
  ) {}

  public createInfoMessage(connectionName: string, outgoingComment: string) {
    switch (this.type) {
      case IncomingRequestType.Notification:
        return `New notification from ${connectionName}.`;
      case IncomingRequestType.Confirmation:
        return `${connectionName} confirmed ${outgoingComment}.`;
      case IncomingRequestType.TextShare:
        return `${connectionName} shared text.`;
      case IncomingRequestType.Response:
        return `${connectionName} responded to ${outgoingComment}.`;
      default:
        throw new TypeError("Invalid request type was provided.");
    }
  }

  public getNotificationTitle() {
    if (this.type !== IncomingRequestType.Notification) {
      throw new TypeError("An unexpected type request.");
    }
    return this.details[IncomingRequest.notificationTitleIndex];
  }

  public getNotificationBody() {
    if (this.type !== IncomingRequestType.Notification) {
      throw new TypeError("An unexpected type request.");
    }
    return this.details[IncomingRequest.notificationBodyIndex];
  }

  public getSharedText() {
    if (this.type !== IncomingRequestType.TextShare) {
      throw new TypeError("An unexpected type request.");
    }
    return this.details[IncomingRequest.textShareTextIndex];
  }

  public getNotificationRequireConfirm() {
    if (this.type !== IncomingRequestType.Notification) {
      throw new TypeError("An unexpected type request.");
    }
    return (
      this.details[IncomingRequest.notificationRequireConfirmIndex] === "True"
    );
  }

  public getTextShareRequireConfirm() {
    if (this.type !== IncomingRequestType.TextShare) {
      throw new TypeError("An unexpected type request.");
    }
    return (
      this.details[IncomingRequest.textShareRequireConfirmIndex] === "True"
    );
  }

  public static fromString(string: string): IncomingRequest {
    const parsedRequest = JSON.parse(string);
    assert(parsedRequest, IncomingRequestStruct);
    IncomingRequest.checkRequestRequiredDetails(parsedRequest);
    return new IncomingRequest(
      parsedRequest.id,
      parsedRequest.type,
      parsedRequest.details,
    );
  }

  private static checkRequestRequiredDetails(
    request: Infer<typeof IncomingRequestStruct>,
  ) {
    if (request.type === IncomingRequestType.Notification) {
      if (request.details.length !== 3) {
        throw new Error(
          "Notification request has an unexpected number of details entries.",
        );
      }
    }
    if (request.type === IncomingRequestType.TextShare) {
      if (request.details.length !== 2) {
        throw new Error(
          "Clipboard fill request has an unexpected number of details entries.",
        );
      }
      if (
        request.details[IncomingRequest.textShareRequireConfirmIndex] !==
          "True" &&
        request.details[IncomingRequest.textShareRequireConfirmIndex] !==
          "False"
      ) {
        throw new Error(
          "Clipboard fill request has an unexpected value at the requireConfirm index.",
        );
      }
    }
  }
}
