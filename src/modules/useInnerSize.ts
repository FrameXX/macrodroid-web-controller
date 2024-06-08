import { useState, useEffect } from "react";

const useInnerSize = (
  isWide: (width: number, height: number) => boolean = (
    width: number,
    height: number,
  ) => width > height,
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

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isWideScreen;
};

export default useInnerSize;
