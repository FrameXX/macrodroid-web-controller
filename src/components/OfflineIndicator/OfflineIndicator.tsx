import { useEffect } from "react";
import { R_Icon } from "../Icon/Icon";
import "./OfflineIndicator.scss";
import { useImmer } from "use-immer";
import { motion, Target } from "framer-motion";

export function R_OfflineIndicator() {
  const [online, setOnline] = useImmer(true);

  function handleOffline() {
    setOnline(false);
  }

  function handleOnline() {
    setOnline(true);
  }

  useEffect(() => {
    addEventListener("offline", handleOffline);
    addEventListener("online", handleOnline);

    return () => {
      removeEventListener("offline", handleOffline);
      removeEventListener("online", handleOnline);
    };
  }, []);

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
