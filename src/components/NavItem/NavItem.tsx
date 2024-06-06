import useWideScreen from "../../modules/useWideScreen";
import R_Icon from "../Icon/Icon";
import "./NavItem.scss";
import { TargetAndTransition, motion } from "framer-motion";

interface NavItemProps {
  title: string;
  iconId: string;
  active: boolean;
  onClick: () => any;
}

export default function R_NavItem(props: NavItemProps) {
  const wideScreen = useWideScreen();
  const animate: TargetAndTransition = {
    color: props.active
      ? "var(--color-primary-item)"
      : "var(--color-primary-item-inactive)",
    scale: props.active ? 1.1 : 1,
    height: wideScreen ? "auto" : "100%",
    padding: wideScreen ? "16px 0" : undefined,
  };

  return (
    <motion.div
      animate={animate}
      role="button"
      tabIndex={0}
      title={props.title}
      className={`nav-item ${props.active ? "active" : ""}`}
      onClick={props.onClick}
    >
      <R_Icon iconId={props.iconId} />
      {props.title}
    </motion.div>
  );
}
