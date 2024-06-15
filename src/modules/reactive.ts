import { useRef, useState } from "react";

export function useReactive<T>(defaultValue: T, autoUpdate = true) {
  const [, setState] = useState(0);
  const ref = useRef(
    isObject(defaultValue) ? createProxy(defaultValue) : defaultValue,
  );
  return new Reactive<T>(ref, updateState, createProxy, autoUpdate);

  function updateState() {
    setState((prev) => prev + 1);
  }

  function createProxy(value: T): T {
    const handler: ProxyHandler<any> = {
      get: (target, prop, receiver) => {
        const val = Reflect.get(target, prop, receiver);
        if (isObject(val)) return createProxy(val);
        return val;
      },
      set: (target, prop, newValue, receiver) => {
        const result = Reflect.set(target, prop, newValue, receiver);
        if (autoUpdate) updateState();
        return result;
      },
    };

    return new Proxy(value, handler);
  }
}

export class Reactive<T> {
  constructor(
    private readonly ref: React.MutableRefObject<T>,
    public updateState: () => void,
    private readonly createProxy: (value: T) => T,
    private readonly autoUpdate: boolean,
  ) {}

  set value(newValue: T) {
    this.ref.current = isObject(newValue)
      ? this.createProxy(newValue)
      : newValue;
    if (this.autoUpdate) this.updateState();
  }

  get value(): T {
    return this.ref.current;
  }
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}
