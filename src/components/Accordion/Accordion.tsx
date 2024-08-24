import { TargetAndTransition, motion } from "framer-motion";
import { useDefaultProps } from "../../modules/use_default_props";
import "./Accordion.scss";
import {
  DEFAULT_TRANSITION_TRANSLATE_PX,
  TRANSITIONS,
} from "../../modules/const";

interface AccordionProps extends React.PropsWithChildren {
  open: boolean;
  className?: string;
  closedHeight?: number | string;
  openHeight?: number | string;
}

const defaultProps: Partial<AccordionProps> = {
  closedHeight: 0,
};

export function R_Accordion(requiredProps: AccordionProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  const fullSqueeze = props.closedHeight === 0;
  const transition = structuredClone(TRANSITIONS);
  transition.bounce = 0;

  const defaultOpenHeight = fullSqueeze ? "auto" : undefined;

  const animate: TargetAndTransition = {
    height: props.open
      ? props.openHeight || defaultOpenHeight
      : props.closedHeight,
    y: props.open || !fullSqueeze ? 0 : -DEFAULT_TRANSITION_TRANSLATE_PX,
    opacity: props.open || !fullSqueeze ? 1 : 0,
    visibility: props.open || !fullSqueeze ? "visible" : "hidden",
    overflow: props.open ? "visible" : "hidden",
    pointerEvents: props.open || !fullSqueeze ? "auto" : "none",
  };

  return (
    <motion.div
      className={props.className}
      transition={transition}
      animate={animate}
    >
      {props.children}
    </motion.div>
  );
}
