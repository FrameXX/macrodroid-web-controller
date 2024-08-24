import { array, number, object, optional, string, unknown } from "superstruct";

export function parseActionArg(arg: string, type: ActionArgType) {
  switch (type) {
    case ActionArgType.Boolean:
      return Boolean(arg);
    case ActionArgType.Integer:
      return parseInt(arg);
    case ActionArgType.Selection:
      return parseInt(arg);
    case ActionArgType.String:
      return arg;
    case ActionArgType.MultiLineString:
      return arg;
    case ActionArgType.Decimal:
      return parseFloat(arg);
  }
}

export function updateJSONString(action: Action) {
  action.JSONstring = undefined;
  action.JSONstring = JSON.stringify(action);
}

export const ActionsStruct = array(
  object({
    id: string(),
    name: string(),
    iconId: string(),
    args: array(
      object({
        id: string(),
        name: string(),
        description: optional(string()),
        value: unknown(),
        type: number(),
        options: optional(array(string())),
        useCondition: optional(
          object({
            argIndex: number(),
            argValue: unknown(),
          }),
        ),
      }),
    ),
    keywords: array(string()),
    notice: optional(string()),
    JSONstring: optional(string()),
  }),
);

export enum ActionArgType {
  Boolean,
  Integer,
  Selection,
  String,
  MultiLineString,
  Decimal,
}

export interface ActionArgUseCondition {
  argIndex: number;
  argValue: unknown;
}

export interface ActionArg<T> {
  id: string;
  name: string;
  description?: string;
  value: T;
  type: ActionArgType;
  options?: string[];
  useCondition?: ActionArgUseCondition;
}

export interface Action {
  id: string;
  name: string;
  iconId: string;
  args: ActionArg<unknown>[];
  keywords: string[];
  JSONstring?: string;
  notice?: string;
}
