import { array, assert, number, object, string } from "superstruct";

export enum IncomingRequestType {
  Response,
  Confirmation,
  Notification,
  ClipboardFill,
}

const RequestStruct = object({
  id: string(),
  type: number(),
  details: array(string()),
});

export class IncomingRequest {
  constructor(
    public readonly id: string,
    public readonly type: IncomingRequestType,
    public readonly details: string[],
  ) {}

  public static fromNtfyRequest(data: string): IncomingRequest {
    const parsedResponse = JSON.parse(data);
    if (!("message" in parsedResponse))
      throw new Error("Parsed response is missing the message property.");
    const parsedRequest = JSON.parse(parsedResponse.message);
    assert(parsedRequest, RequestStruct);
    return new IncomingRequest(
      parsedRequest.id,
      parsedRequest.type,
      parsedRequest.details,
    );
  }
}
