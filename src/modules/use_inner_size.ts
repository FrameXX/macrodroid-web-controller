import { useState, useEffect } from "react";

const useInnerSize = (
  checkMeetsConditions: (width: number, height: number) => boolean = (
    width,
    height,
  ) => width > 600 && height > 400,
) => {
  const [meetsConditions, setMeetsConditions] = useState(
    window.innerWidth > window.innerHeight,
  );

  useEffect(() => {
    const handleResize = () => {
      const wideScreen = checkMeetsConditions(innerWidth, innerHeight);
      setMeetsConditions(wideScreen);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return meetsConditions;
};

export default useInnerSize;
