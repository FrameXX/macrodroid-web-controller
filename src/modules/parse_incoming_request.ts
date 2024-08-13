import { array, assert, number, object, string } from "superstruct";

export interface ParsedIncomingRequest {
  id: number;
  data: string[];
}

const IncomingRequestStruct = object({ id: number(), data: array(string()) });

export function parseIncomingRequest(
  responseData: string,
): ParsedIncomingRequest {
  const parsedResponse = JSON.parse(responseData);
  assert(parsedResponse, IncomingRequestStruct);
  return parsedResponse;
}
