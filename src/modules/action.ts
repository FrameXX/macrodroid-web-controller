import { any, array, number, object, optional, string } from "superstruct";

export const ActionStruct = object({
  id: string(),
  name: string(),
  iconId: string(),
  args: array(
    object({
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
});

export enum ActionArgumentType {
  String,
  MultiLineString,
  Int,
  Decimal,
  Boolean,
  Selection,
}

export interface ActionArgUseCondition {
  argumentIndex: number;
  argumentValue: any;
}

export interface ActionArg<T> {
  name: string;
  description?: string;
  value: T;
  type: ActionArgumentType;
  options?: string[];
  useCondition?: ActionArgUseCondition;
}

export interface Action {
  id: string;
  name: string;
  iconId: string;
  args: ActionArg<any>[];
  keywords: string[];
}
