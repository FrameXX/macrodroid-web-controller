import { useEffect } from "react";

export function useKey(key: string, handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === key) {
        handler(event);
      }
    }

    document.addEventListener("keyup", handleKeyDown);

    return () => {
      document.removeEventListener("keyup", handleKeyDown);
    };
  }, [handler]);
}
