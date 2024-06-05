import { Toast } from "../../modules/toaster";
import R_Icon from "../Icon/Icon";
import { TargetAndTransition, motion } from "framer-motion";
import "./Toast.scss";
import { useState } from "react";
import { defaultTransitionOffset } from "../../modules/const";

interface ToastProps {
  toast: Toast;
  onClick: (id: number) => any;
}

export default function R_Toast(props: ToastProps) {
  const [hovering, setHovering] = useState(false);
  const overlayAnimate: TargetAndTransition = hovering
    ? {}
    : { opacity: 0, y: -defaultTransitionOffset };

  return (
    <motion.div
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      layout
      initial={{ opacity: 0, y: -defaultTransitionOffset }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -defaultTransitionOffset }}
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
