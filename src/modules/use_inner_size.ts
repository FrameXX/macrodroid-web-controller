import { useState, useEffect } from "react";

const useInnerSize = (
  isWide: (width: number, height: number) => boolean = (width, height) =>
    width > 600 && height > 400,
) => {
  const [isWideScreen, setIsWideScreen] = useState(
    window.innerWidth > window.innerHeight,
  );

  useEffect(() => {
    const handleResize = () => {
      const wideScreen = isWide(innerWidth, innerHeight);
      setIsWideScreen(wideScreen);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isWideScreen;
};

export default useInnerSize;
