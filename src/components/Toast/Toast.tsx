import { Toast } from "../../modules/toaster";
import R_Icon from "../Icon/Icon";
import { Target, motion } from "framer-motion";
import "./Toast.scss";
import { DEFAULT_TRANSITION_OFFSET } from "../../modules/const";
import { useImmer } from "use-immer";

interface ToastProps {
  toast: Toast;
  onClick: (id: number) => void;
}

/**
 * Renders a toast component with the given props.
 *
 * @param {ToastProps} props - The props for the toast component.
 * @param {Toast} props.toast - The toast data.
 * @param {Function} props.onClick - The function to be called when the toast is clicked.
 * @return {JSX.Element} The rendered toast component.
 */
export default function R_Toast(props: ToastProps) {
  const [hovering, setHovering] = useImmer(false);
  const overlayAnimate: Target = hovering
    ? {}
    : { opacity: 0, y: -DEFAULT_TRANSITION_OFFSET };

  const animateUnmounted: Target = {
    opacity: 0,
    y: -DEFAULT_TRANSITION_OFFSET,
  };
  const animateMounted: Target = {
    opacity: 1,
    y: 0,
  };

  return (
    <motion.div
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      layout
      initial={animateUnmounted}
      animate={animateMounted}
      exit={animateUnmounted}
      className={`toast ${props.toast.severity}`}
      onClick={() => props.onClick(props.toast.id)}
    >
      {props.toast.iconId && <R_Icon side iconId={props.toast.iconId} />}
      {props.toast.message}
      <motion.div animate={overlayAnimate} className="close-overlay">
        <R_Icon iconId="close" side />
        DISMISS
      </motion.div>
    </motion.div>
  );
}
