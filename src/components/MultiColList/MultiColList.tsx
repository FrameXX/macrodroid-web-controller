import { motion } from "framer-motion";
import { PropsWithChildren, useRef } from "react";
import { useColumnDeterminator } from "../../modules/use_column_determinator";
import { useDefaultProps } from "../../modules/use_default_props";

interface MultiColListProps extends PropsWithChildren {
  items: unknown[];
  minColWidthPx?: number;
  maxCols?: number;
  id?: string;
  className?: string;
}

const defaultProps: Partial<MultiColListProps> = {
  minColWidthPx: 350,
  maxCols: 5,
};

export function R_MultiColList(requiredProps: MultiColListProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  const parent = useRef<HTMLDivElement>(null);
  const columnCount = useColumnDeterminator(
    parent,
    props.items,
    props.minColWidthPx,
    props.maxCols,
  );

  return (
    <motion.div
      id={props.id}
      animate={{ columnCount }}
      ref={parent}
      className={props.className}
    >
      {props.children}
    </motion.div>
  );
}
