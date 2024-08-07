import { Target, motion } from "framer-motion";
import { forwardRef } from "react";
import { DEFAULT_TRANSITION_TRANSLATE_PX } from "../../modules/const";
import "./Tab.scss";

interface TabProps extends React.PropsWithChildren {
  active: boolean;
}

export const R_Tab = forwardRef<HTMLDivElement, TabProps>((props, ref) => {
  const animate: Target = props.active
    ? {}
    : { y: -DEFAULT_TRANSITION_TRANSLATE_PX, opacity: 0, display: "none" };

  return (
    <motion.section className="tab" animate={animate}>
      <div ref={ref} className="scrollable-container">
        {props.children}
      </div>
    </motion.section>
  );
});
