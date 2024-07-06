import { Action, ActionArgument, ActionArgumentType } from "./action";
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
  argumentType: ActionArgumentType,
  index: number,
) {
  switch (argumentType) {
    case ActionArgumentType.Boolean:
      return `booleanArgs(${index})`;
    case ActionArgumentType.Int || ActionArgumentType.Selection:
      return `intArgs(${index})`;
    case ActionArgumentType.Decimal:
      return `decimalArgs(${index})`;
    case ActionArgumentType.String || ActionArgumentType.MultiLineString:
      return `stringArgs(${index})`;
    default:
      throw new TypeError("Unsupported argument type.");
  }
}

function actionArgsToSearchParams(
  actionArgs: ActionArgument<any>[],
): SearchParam[] {
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
    public readonly detail?: string,
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
    const detail = action.args
      .map((argument) => {
        return `${argument.name}: ${argument.value}`;
      })
      .join("\n");
    return new OutgoingRequest(
      OutgoingRequestType.Action,
      actionArgsToSearchParams(action.args),
      comment,
      detail,
    );
  }
}
