import {
  StructError,
  array,
  assert,
  number,
  object,
  string,
} from "superstruct";

export interface Response {
  requestId: number;
  data: string[];
}

const ResponseStruct = object({ requestId: number(), data: array(string()) });

export function parseResponse(
  responseData: any,
  onError: (message: string) => any,
): Response | void {
  let parsedResponse;

  try {
    parsedResponse = JSON.parse(responseData);
  } catch (error) {
    onError("Could not parse response data into JS object.");
  }

  try {
    assert(parsedResponse, ResponseStruct);
  } catch (error) {
    error instanceof StructError
      ? onError(error.message)
      : console.error("Superstruct assertion threw an unknown type of error");
  }

  return parsedResponse;
}
