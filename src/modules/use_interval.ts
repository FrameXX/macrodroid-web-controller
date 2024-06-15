import { useEffect, useState } from "react";

export function useInterval(intervalMs: number) {
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCycles((x) => x + 1);
    }, intervalMs);
    return () => clearInterval(intervalId);
  }, []);

  return cycles;
}
