import { Target, motion } from "framer-motion";
import { PropsWithChildren } from "react";
import useDefaultProps from "../../modules/use_default_props";
import "./Accordeon.scss";
import { DEFAULT_TRANSITION_OFFSET, TRANSITIONS } from "../../modules/const";

interface AccordeonProps extends PropsWithChildren {
  open: boolean;
  className: string;
  closedHeight?: number | string;
}

const defaultProps: Partial<AccordeonProps> = {
  closedHeight: 0,
};

export default function R_Accordeon(props: AccordeonProps) {
  const usedProps = useDefaultProps(props, defaultProps);

  const transition = structuredClone(TRANSITIONS) as any;
  transition.bounce = 0;

  const animate: Target = {
    height: usedProps.open ? "auto" : usedProps.closedHeight,
    y: usedProps.open ? 0 : -DEFAULT_TRANSITION_OFFSET,
    opacity: usedProps.open ? 1 : usedProps.closedHeight === 0 ? 0 : 1,
  };

  return (
    <motion.div
      transition={transition}
      className={`accordeon ${usedProps.className}`}
      animate={animate}
    >
      {props.children}
    </motion.div>
  );
}
