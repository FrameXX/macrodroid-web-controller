import { TargetAndTransition, motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { useDefaultProps } from "../../modules/use_default_props";
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

export function R_Accordion(requiredProps: AccordionProps) {
  const props = useDefaultProps(requiredProps, defaultProps);
  const fullSqueeze = props.closedHeight === 0;

  const transition = structuredClone(TRANSITIONS) as any;
  transition.bounce = 0;

  const animate: TargetAndTransition = {
    height: props.open ? undefined : props.closedHeight,
    y: props.open || !fullSqueeze ? 0 : -DEFAULT_TRANSITION_OFFSET,
    opacity: props.open || !fullSqueeze ? 1 : 0,
    visibility: props.open || !fullSqueeze ? "visible" : "hidden",
  };

  return (
    <motion.div
      transition={transition}
      className={`accordeon ${props.className}`}
      animate={animate}
    >
      {props.children}
    </motion.div>
  );
}
