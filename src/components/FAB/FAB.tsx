import { TargetAndTransition, motion } from "framer-motion";
import useDefaultProps from "../../modules/use_default_props";
import R_Icon from "../Icon/Icon";
import "./FAB.scss";

interface FABProps {
  onClick: () => any;
  left?: boolean;
  hidden?: boolean;
  iconId: string;
  title: string;
}

const defaultProps: Partial<FABProps> = { left: false, hidden: false };

export default function R_FAB(props: FABProps) {
  const usedProps = useDefaultProps(props, defaultProps);
  const animate: TargetAndTransition = {
    scale: usedProps.hidden ? 0 : 1,
    opacity: usedProps.hidden ? 0 : 1,
    pointerEvents: usedProps.hidden ? "none" : "all",
  };
  return (
    <motion.button
      animate={animate}
      type="button"
      title={usedProps.title}
      onClick={usedProps.onClick}
      className={`fab ${usedProps.left ? "left" : "right"}`}
    >
      <R_Icon iconId={usedProps.iconId} />
    </motion.button>
  );
}
