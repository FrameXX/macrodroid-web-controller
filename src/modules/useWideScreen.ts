import { useState, useEffect } from "react";

const useWideScreen = () => {
  const [isWideScreen, setIsWideScreen] = useState(
    window.innerWidth > window.innerHeight,
  );

  useEffect(() => {
    const handleResize = () => {
      const isWide = window.innerWidth > window.innerHeight;
      setIsWideScreen(isWide);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isWideScreen;
};

export default useWideScreen;
