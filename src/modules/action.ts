import { any, array, number, object, optional, string } from "superstruct";

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
        value: any(),
        type: number(),
        options: optional(array(string())),
        useCondition: optional(
          object({
            argumentIndex: number(),
            argumentValue: any(),
          }),
        ),
      }),
    ),
    keywords: array(string()),
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
  argumentIndex: number;
  argumentValue: any;
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
  args: ActionArg<any>[];
  keywords: string[];
  JSONstring?: string;
}
