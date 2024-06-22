import { TargetAndTransition, motion } from "framer-motion";
import { PropsWithChildren } from "react";
import useDefaultProps from "../../modules/use_default_props";
import "./Accordion.scss";
import { DEFAULT_TRANSITION_OFFSET, TRANSITIONS } from "../../modules/const";

interface AccordionProps extends PropsWithChildren {
  open: boolean;
  className?: string;
  closedHeight?: number | string;
}

const defaultProps: Partial<AccordionProps> = {
  closedHeight: 0,
};

export default function R_Accordion(props: AccordionProps) {
  const usedProps = useDefaultProps(props, defaultProps);
  const fullSqueeze = usedProps.closedHeight === 0;

  const transition = structuredClone(TRANSITIONS) as any;
  transition.bounce = 0;

  const animate: TargetAndTransition = {
    height: usedProps.open ? "auto" : usedProps.closedHeight,
    y: usedProps.open || !fullSqueeze ? 0 : -DEFAULT_TRANSITION_OFFSET,
    opacity: usedProps.open || !fullSqueeze ? 1 : 0,
    visibility: usedProps.open || !fullSqueeze ? "visible" : "hidden",
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
