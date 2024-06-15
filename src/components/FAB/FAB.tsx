import { TargetAndTransition, motion } from "framer-motion";
import useDefaultProps from "../../modules/use_default_props";
import R_Icon from "../Icon/Icon";
import "./FAB.scss";

interface FABProps {
  onClick: () => void;
  left?: boolean;
  hidden?: boolean;
  iconId: string;
  title: string;
}

const defaultProps: Partial<FABProps> = { left: false, hidden: false };

/**
 * Renders a floating action button (FAB) with an icon and optional title.
 *
 * @param {FABProps} props - The properties for the FAB component.
 * @param {() => void} props.onClick - The function to call when the FAB is clicked.
 * @param {boolean} [props.left] - Whether the FAB should be positioned on the left side.
 * @param {boolean} [props.hidden] - Whether the FAB should be hidden.
 * @param {string} props.iconId - The ID of the icon to display in the FAB.
 * @param {string} props.title - The title to display in the FAB.
 * @return {JSX.Element} The rendered FAB component.
 */
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
