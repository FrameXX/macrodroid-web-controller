import { useEffect, useRef } from "react";
import { Struct, assert } from "superstruct";

export interface StoreConfig<T> {
  struct: Struct<any>;
  storageKey: string;
  stringify: (object: T) => string;
  parse: (stringified: string) => unknown;
  onRecoverError?: (errorMessage: string) => void;
  finalize?: (validated: T) => T;
}

export function useLocalStorage<T extends any[]>(
  state: T,
  setState: (newState: T) => void,
  recoverConfig: StoreConfig<T>,
) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender.current) return;
    if (!navigator.cookieEnabled) return;
    const recovered = recover<T>(recoverConfig);
    if (recovered) setState(recovered);
  }, []);

  useEffect(() => {
    if (!navigator.cookieEnabled) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    save(state, recoverConfig.stringify, recoverConfig.storageKey);
  }, [state]);

  return [state, setState] as const;
}

function save<T>(
  state: T,
  stringify: (object: T) => string,
  storageKey: string,
) {
  localStorage.setItem(storageKey, stringify(state));
}

function validateObject(object: unknown, struct: Struct<any>): string | void {
  try {
    assert(object, struct);
  } catch (error) {
    if (error instanceof Error) return error.message;
    return "Object has an invalid structure.";
  }
  return;
}

function recover<T>(
  config: StoreConfig<T>,
  onError?: (errorMessage: string) => void,
): T | null {
  const stringified = localStorage.getItem(config.storageKey);
  if (!stringified) return null;

  let parsed: unknown;
  try {
    parsed = config.parse(stringified);
  } catch (error) {
    if (onError && error instanceof Error) onError(error.message);
    return null;
  }

  const errorMessage = validateObject(parsed, config.struct);
  if (errorMessage) {
    if (config.onRecoverError) config.onRecoverError(errorMessage);
    return null;
  }
  let validated = parsed as T;

  if (config.finalize) validated = config.finalize(validated);
  return validated;
}
