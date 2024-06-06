import R_Icon from "../Icon/Icon";
import "./NavItem.scss";
import { motion } from "framer-motion";

interface NavItemProps {
  title: string;
  iconId: string;
  active: boolean;
  onClick: () => any;
}

export default function R_NavItem(props: NavItemProps) {
  const scale = props.active ? 1.1 : 1;
  return (
    <motion.div
      animate={{ scale }}
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
