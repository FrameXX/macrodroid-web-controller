import { Toast } from "../../modules/toaster";
import R_Icon from "../Icon/Icon";
import { motion } from "framer-motion";
import "./Toast.scss";

interface ToastProps {
  toast: Toast;
  onClick: (id: number) => any;
}

export default function R_Toast(props: ToastProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, translateY: "-200%", scale: 0.7 }}
      animate={{ opacity: 1, translateY: "none", scale: 1 }}
      exit={{ opacity: 0, translateY: "-200%", scale: 0.7 }}
      className="toast"
      onClick={() => props.onClick(props.toast.id)}
    >
      {props.toast.iconId && <R_Icon side iconId={props.toast.iconId} />}
      {props.toast.message}
      <div className="close-overlay">
        <R_Icon iconId="close" side />
        DISMISS
      </div>
    </motion.div>
  );
}
