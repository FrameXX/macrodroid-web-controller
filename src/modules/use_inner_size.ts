import { useState } from "react";

const useInnerSize = (
  checkMeetsConditions: (width: number, height: number) => boolean = (
    width,
    height,
  ) => width > 600 && height > 400,
) => {
  const [meetsConditions, setMeetsConditions] = useState(
    innerWidth > innerHeight,
  );

  function handleResize() {
    const wideScreen = checkMeetsConditions(innerWidth, innerHeight);
    setMeetsConditions(wideScreen);
  }

  addEventListener("resize", handleResize);

  return meetsConditions;
};

export default useInnerSize;
