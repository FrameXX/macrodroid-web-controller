import { R_Icon } from "../Icon/Icon";
import "./OfflineIndicator.scss";
import { motion, Target } from "framer-motion";
import { useOnline } from "../../modules/use_online";

export function R_OfflineIndicator() {
  const online = useOnline();

  const animateUnmounted: Target = {
    opacity: 0,
    x: "100%",
    y: "-100%",
  };

  const animateMounted: Target = {
    opacity: 0.7,
    x: 0,
    y: 0,
  };

  return (
    <motion.div
      animate={online ? animateUnmounted : animateMounted}
      className="offline-indicator"
    >
      <R_Icon iconId="web-off" />
      Network access unavailable.
    </motion.div>
  );
}
