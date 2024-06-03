import R_Icon from "../Icon/Icon";
import { NavTab } from "../Nav/Nav";
import "./NavItem.scss";
import { motion } from "framer-motion";

interface NavItemProps {
  active: boolean;
  navTab: NavTab;
  onClick: () => any;
}

export default function R_NavItem(props: NavItemProps) {
  const scale = props.active ? 1.15 : 1;
  return (
    <motion.div
      animate={{ scale }}
      role="button"
      tabIndex={0}
      className={`nav-item ${props.active ? "active" : ""}`}
      onClick={props.onClick}
    >
      <R_Icon iconId={props.navTab.iconId} />
      {props.navTab.title}
    </motion.div>
  );
}
