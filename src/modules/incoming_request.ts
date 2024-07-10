import { array, assert, object, string } from "superstruct";

const RequestStruct = object({ id: string(), details: array(string()) });

export class IncomingRequest {
  constructor(
    public readonly id: string,
    public readonly details: string[],
  ) {}

  public static fromNtfyRequest(data: string): IncomingRequest {
    const parsedResponse = JSON.parse(data);
    if (!("message" in parsedResponse))
      throw new Error("Parsed response is missing the message property.");
    const parsedRequest = JSON.parse(parsedResponse.message);
    assert(parsedRequest, RequestStruct);
    return new IncomingRequest(parsedRequest.id, parsedRequest.details);
  }
}
