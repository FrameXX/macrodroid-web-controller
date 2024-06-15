import { TargetAndTransition, motion } from "framer-motion";
import { PropsWithChildren } from "react";
import useDefaultProps from "../../modules/use_default_props";

interface AccordeonProps extends PropsWithChildren {
  open: boolean;
  className: string;
  closedHeight?: number;
}

const defaultProps: Partial<AccordeonProps> = {
  closedHeight: 0,
};

export default function R_Accordeon(props: AccordeonProps) {
  const usedProps = useDefaultProps(props, defaultProps);
  const animate: TargetAndTransition = {
    height: usedProps.open ? "auto" : usedProps.closedHeight,
  };

  return (
    <motion.div className={usedProps.className} animate={animate}>
      {props.children}
    </motion.div>
  );
}
