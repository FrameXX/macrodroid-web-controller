import { Dispatch, SetStateAction, useRef, useState } from "react";

export class Reactive<T> {
  private _setState: Dispatch<SetStateAction<number>>;
  private _value: React.MutableRefObject<T>;

  constructor(
    defaultValue: T,
    private readonly autoUpdate = true,
  ) {
    this._value = useRef(this.createProxy(defaultValue));

    const [, setState] = useState(0);
    this._setState = setState;
  }

  set value(newValue: T) {
    this._value.current = this.createProxy(newValue);
    if (this.autoUpdate) this.updateState();
  }

  get value(): T {
    return this._value.current;
  }

  public updateState() {
    this._setState((prev) => prev + 1);
  }

  private createProxy(value: T): T {
    if (typeof value !== "object" || value === null) {
      return value;
    }

    const handler: ProxyHandler<any> = {
      get: (target, prop, receiver) => {
        const val = Reflect.get(target, prop, receiver);
        if (typeof val === "object" && val !== null) {
          return this.createProxy(val);
        }
        return val;
      },
      set: (target, prop, newValue, receiver) => {
        const result = Reflect.set(target, prop, newValue, receiver);
        if (this.autoUpdate) this.updateState();
        return result;
      },
    };

    return new Proxy(value, handler);
  }
}
