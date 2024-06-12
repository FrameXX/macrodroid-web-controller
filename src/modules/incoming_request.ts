import { array, assert, object, string } from "superstruct";

const IncomingRequestStruct = object({ id: string(), data: array(string()) });

export class IncomingRequest {
  constructor(
    public readonly id: string,
    public readonly data: string[],
  ) {}

  public static fromString(string: string): IncomingRequest {
    const parsedResponse = JSON.parse(string);
    assert(parsedResponse, IncomingRequestStruct);
    return new IncomingRequest(parsedResponse.id, parsedResponse.data);
  }
}
