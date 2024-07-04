import { useEffect, useState } from "react";

function useResizeObserver(
  elementRef: React.MutableRefObject<HTMLElement | null>,
  checkMeetsConditions: (width: number, height: number) => boolean = (
    width,
    height,
  ) => width > height,
) {
  const [meetsConditions, setMeetsConditions] = useState<boolean>(false);

  function handleResize(width: number, height: number) {
    if (width === 0 && height === 0) return;
    setMeetsConditions(checkMeetsConditions(width, height));
  }

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      console.warn("Element to be observed on resizes is not available.");
      return;
    }
    const observer = new ResizeObserver(() => {
      handleResize(element.clientWidth, element.clientHeight);
    });
    observer.observe(element);
    handleResize(element.clientWidth, element.clientHeight);
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef]);

  return meetsConditions;
}

export default useResizeObserver;
