import { useInnerSize } from "../../modules/use_inner_size";
import { R_Icon } from "../Icon/Icon";
import "./NavItem.scss";
import { Target, motion } from "framer-motion";

interface NavItemProps {
  title: string;
  iconId: string;
  active: boolean;
  onClick: () => void;
}

/**
 * Renders a navigation item with an icon and title. The item can be active or inactive, and it can be clicked to trigger an action.
 *
 * @param {NavItemProps} props - The props for the R_NavItem component.
 * @param {string} props.title - The title of the navigation item.
 * @param {string} props.iconId - The id of the icon to display.
 * @param {boolean} props.active - Whether the navigation item is active or not.
 * @param {() => any} props.onClick - The function to call when the navigation item is clicked.
 * @return {JSX.Element} The rendered navigation item.
 */
export function R_NavItem(props: NavItemProps) {
  const wideScreen = useInnerSize(
    () => innerWidth > innerHeight && innerHeight > 500,
  );
  const animate: Target = {
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
