import { Action, ActionArg, ActionArgType } from "./action";
import { CONFIRM_CONNECTION_REQUEST_COMMENT } from "./const";
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

function searchParamNameFromActionArgument(
  argType: ActionArgType,
  argId: string,
) {
  switch (argType) {
    case ActionArgType.Boolean:
      return `booleanArgs(${argId})`;
    case ActionArgType.Integer:
    case ActionArgType.Selection:
      return `integerArgs(${argId})`;
    case ActionArgType.Decimal:
      return `decimalArgs(${argId})`;
    case ActionArgType.String:
    case ActionArgType.MultiLineString:
      return `stringArgs(${argId})`;
    default:
      throw new TypeError("Unsupported argument type.");
  }
}

function actionArgsToSearchParams(actionArgs: ActionArg<any>[]): SearchParam[] {
  return actionArgs.map((arg) => {
    return {
      name: searchParamNameFromActionArgument(arg.type, arg.id),
      value: `${arg.value}`,
    };
  });
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

  public static runAction(action: Action, requireConfirmation: boolean) {
    const comment = `Action: ${action.name}`;
    const details = action.args.map((arg) => `${arg.name}: ${arg.value}`);
    const searchParams = [
      ...actionArgsToSearchParams(action.args),
      { name: "actionId", value: action.id },
      {
        name: "requireConfirmation",
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
