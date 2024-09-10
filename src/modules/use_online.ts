import { useEffect, useState } from "react";

export function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);

  function handleOffline() {
    setOnline(false);
  }

  function handleOnline() {
    setOnline(true);
  }

  useEffect(() => {
    addEventListener("offline", handleOffline);
    addEventListener("online", handleOnline);

    return () => {
      removeEventListener("offline", handleOffline);
      removeEventListener("online", handleOnline);
    };
  }, []);

  return online;
}
