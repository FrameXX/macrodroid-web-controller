import { useEffect, useState } from "react";

function useInnerSize(
  checkMeetsConditions: () => boolean = () => innerWidth > innerHeight,
) {
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
