import useResizeObserver from "./use_resize_observer";

export function useColumnDeterminator(parentRef: React.MutableRefObject<HTMLElement | null>, childrenArray: any[], minColumnWidth: number) {
    const secondColumn = useResizeObserver(
        parentRef,
        (width) => width > 2*minColumnWidth,
      );
      const thirdColumn = useResizeObserver(
        parentRef,
        (width) => width > 3*minColumnWidth,
      );
      const fourthColumn = useResizeObserver(
        parentRef,
        (width) => width > 4*minColumnWidth,
      );

      let columns: number;
      if (fourthColumn && childrenArray.length > 3) {
        columns = 4;
      } else if (thirdColumn && childrenArray.length > 2) {
        columns = 3;
      } else if (secondColumn && childrenArray.length > 1) {
        columns = 2;
      } else {
        columns = 1;
      }
      return columns
}