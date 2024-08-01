import { useResizeObserver } from "./use_resize_observer";

export function useColumnDeterminator(
  parentRef: React.MutableRefObject<HTMLElement | null>,
  childrenArray: any[],
  minColumnWidth: number,
  maxColumns: number = 5,
) {
  const secondCol = useResizeObserver(
    parentRef,
    (width) => width > 2 * minColumnWidth,
  );
  const thirdCol = useResizeObserver(
    parentRef,
    (width) => width > 3 * minColumnWidth,
  );
  const fourthCol = useResizeObserver(
    parentRef,
    (width) => width > 4 * minColumnWidth,
  );
  const fifthCol = useResizeObserver(
    parentRef,
    (width) => width > 4 * minColumnWidth,
  );

  let columns: number;
  if (fifthCol && childrenArray.length > 4) {
    columns = 5;
  } else if (fourthCol && childrenArray.length > 3) {
    columns = 4;
  } else if (thirdCol && childrenArray.length > 2) {
    columns = 3;
  } else if (secondCol && childrenArray.length > 1) {
    columns = 2;
  } else {
    columns = 1;
  }
  columns = Math.min(columns, maxColumns);
  return columns;
}
