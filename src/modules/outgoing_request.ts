import {
  Action,
  ActionArg,
  ActionArgType,
  generateActionSearchParams,
} from "./action";
import {
  CONFIRM_CONNECTION_REQUEST_COMMENT,
  REQUIRE_CONFIRMATION_PARAM_NAME,
} from "./const";
import { Random } from "./random";

export enum OutgoingRequestType {
  Add = "add",
  Action = "action",
  Poke = "poke",
  Confirm = "confirm",
}

export interface SearchParam {
  name: string;
  value: string;
}

function generateActionArgDetail(arg: ActionArg<unknown>) {
  const value =
    arg.type === ActionArgType.Selection &&
    typeof arg.value === "number" &&
    arg.options
      ? arg.options[arg.value]
      : arg.value;
  return `${arg.name}: ${value}`;
}

export class OutgoingRequest {
  constructor(
    public readonly type: OutgoingRequestType,
    public readonly data: SearchParam[],
    public readonly comment: string,
    public readonly id: string,
    public readonly details?: string[],
  ) {}

  public static createAddConnectionRequest() {
    return new OutgoingRequest(
      OutgoingRequestType.Add,
      [],
      CONFIRM_CONNECTION_REQUEST_COMMENT,
      Random.readableId(),
    );
  }

  public static createPokeRequest() {
    return new OutgoingRequest(
      OutgoingRequestType.Poke,
      [],
      "Connection confirmation",
      Random.readableId(),
    );
  }

  public static createConfirmRequest(
    requestId: string,
    incomingComment: string,
  ) {
    const searchParams = [{ name: "requestId", value: requestId }];
    const comment = `Confirm: ${incomingComment}`;
    return new OutgoingRequest(
      OutgoingRequestType.Confirm,
      searchParams,
      comment,
      requestId,
    );
  }

  public static createActionRequest(
    action: Action,
    requireConfirmation: boolean,
  ) {
    const comment = `Action: ${action.name}`;
    const details = action.args.map(generateActionArgDetail);
    const searchParams = [
      ...generateActionSearchParams(action),
      {
        name: REQUIRE_CONFIRMATION_PARAM_NAME,
        value: requireConfirmation.toString(),
      },
    ];
    return new OutgoingRequest(
      OutgoingRequestType.Action,
      searchParams,
      comment,
      Random.readableId(),
      details,
    );
  }
}
