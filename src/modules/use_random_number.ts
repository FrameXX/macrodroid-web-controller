import { useMemo } from "react";

export function useRandomNumber(generator: () => any) {
  const id = useMemo(generator, []);
  return id;
}
