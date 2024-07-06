import { useEffect, useState } from "react";

function useInnerSize(checkMeetsConditions: () => boolean) {
  const [meetsConditions, setMeetsConditions] =
    useState<boolean>(checkMeetsConditions);

  function handleResize() {
    setMeetsConditions(checkMeetsConditions());
  }

  useEffect(() => {
    addEventListener("resize", handleResize);
    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  return meetsConditions;
}

export default useInnerSize;
