import { Target, motion } from "framer-motion";
import { PropsWithChildren, forwardRef } from "react";
import { DEFAULT_TRANSITION_OFFSET } from "../../modules/const";
import "./Tab.scss";

interface TabProps extends PropsWithChildren {
  active: boolean;
}

const R_Tab = forwardRef<HTMLDivElement, TabProps>((props, ref) => {
  const animate: Target = props.active
    ? {}
    : { y: -DEFAULT_TRANSITION_OFFSET, opacity: 0, display: "none" };

  return (
    <motion.section className="tab" animate={animate}>
      <div ref={ref} className="scrollable-container">
        {props.children}
      </div>
    </motion.section>
  );
});

export default R_Tab;
