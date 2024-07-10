import { Action, ActionArg, ActionArgType } from "./action";
import { Random } from "./random";

export enum OutgoingRequestType {
  Add = "add",
  Action = "action",
  Poke = "poke",
}

export enum OutGoingRequestStatus {
  NotSend,
  Success,
  Failed,
}

export interface SearchParam {
  name: string;
  value: string;
}

function searchParamNameFromActionArgument(
  argType: ActionArgType,
  argId: string,
) {
  console.log(argType, ActionArgType.Selection);
  switch (argType) {
    case ActionArgType.Boolean:
      return `booleanArgs(${argId})`;
    case ActionArgType.Int:
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
  public readonly id: string;

  constructor(
    public readonly type: OutgoingRequestType,
    public readonly data: SearchParam[],
    public readonly comment?: string,
    public readonly details?: string[],
    idLenght: number = 5,
  ) {
    this.id = Random.readableId(idLenght);
  }

  public static addConnection() {
    return new OutgoingRequest(
      OutgoingRequestType.Add,
      [],
      "Connection creation confirmation",
    );
  }

  public static poke() {
    return new OutgoingRequest(OutgoingRequestType.Poke, [], "Poke");
  }

  public static runAction(action: Action) {
    const comment = `Action: ${action.name}`;
    const details = action.args.map((arg) => `${arg.name}: ${arg.value}`);
    const searchParams = [
      ...actionArgsToSearchParams(action.args),
      { name: "actionId", value: action.id },
    ];
    return new OutgoingRequest(
      OutgoingRequestType.Action,
      searchParams,
      comment,
      details,
    );
  }
}
