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
  argumentType: ActionArgType,
  index: number,
) {
  switch (argumentType) {
    case ActionArgType.Boolean:
      return `booleanArgs(${index})`;
    case ActionArgType.Int || ActionArgType.Selection:
      return `intArgs(${index})`;
    case ActionArgType.Decimal:
      return `decimalArgs(${index})`;
    case ActionArgType.String || ActionArgType.MultiLineString:
      return `stringArgs(${index})`;
    default:
      throw new TypeError("Unsupported argument type.");
  }
}

function actionArgsToSearchParams(actionArgs: ActionArg<any>[]): SearchParam[] {
  return actionArgs.map((argument, index) => {
    return {
      name: searchParamNameFromActionArgument(argument.type, index),
      value: `${argument.value}`,
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
