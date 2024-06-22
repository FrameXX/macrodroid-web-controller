export enum ActionArgumentType {
  String,
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
  use?: ActionArgumentUseCondition;
}

export interface Action {
  name: string;
  iconId: string;
  args: ActionArgument<any>[];
}
