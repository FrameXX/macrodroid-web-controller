export enum ActionArgumentType {
  String,
  MultiLineString,
  Int,
  Decimal,
  Boolean,
  Selection,
}

export interface ActionArgumentUseCondition {
  argumentIndex: number;
  argumentValue: any;
}

export interface ActionArgument<T> {
  name: string;
  description?: string;
  value: T;
  type: ActionArgumentType;
  options?: string[];
  useCondition?: ActionArgumentUseCondition;
}

export interface Action {
  id: string;
  name: string;
  iconId: string;
  arguments: ActionArgument<any>[];
  keywords: string[];
}
