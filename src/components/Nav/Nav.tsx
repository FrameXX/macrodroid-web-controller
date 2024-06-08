import { useState } from "react";
import R_NavItem from "../NavItem/NavItem";
import "./Nav.scss";
import { TargetAndTransition, motion } from "framer-motion";
import useInnerSize from "../../modules/useInnerSize";

export type NavTabId = "connections" | "actions" | "log" | "extras";

interface NavProps {
  navTabId: NavTabId;
  onTabSwitch?: (newNavTabId: NavTabId) => any;
}

/**
 * Renders a navigation bar with tab items that can be switched between.
 *
 * @param {NavProps} props - The props for the R_Nav component.
 * @param {NavTabId} props.navTabId - The initial active tab id.
 * @param {(newNavTabId: NavTabId) => any} [props.onTabSwitch] - A callback function that is called when a tab is switched.
 * @return {JSX.Element} The rendered navigation bar.
 */
export default function R_Nav(props: NavProps) {
  const [activeNavTabId, setActiveNavTabId] = useState<NavTabId>(
    props.navTabId,
  );

  function swicthTab(newId: NavTabId) {
    setActiveNavTabId(newId);
    if (props.onTabSwitch) props.onTabSwitch(newId);
  }

  const wideScreen = useInnerSize();

  const animate: TargetAndTransition = wideScreen
    ? {
      top: 0,
      flexDirection: "column",
      justifyContent: "start",
      height: "100%",
      width: 125,
      overflowX: "hidden",
      overflowY: "auto",
    }
    : {
      right: 0,
      justifyContent: "space-evenly",
      width: "100%",
      height: 80,
    };

  return (
    <motion.nav layout animate={animate}>
      <R_NavItem
        active={activeNavTabId === "connections"}
        onClick={() => swicthTab("connections")}
        iconId="transit-connection-variant"
        title="Connections"
      />
      <R_NavItem
        active={activeNavTabId === "actions"}
        onClick={() => swicthTab("actions")}
        iconId="play"
        title="Actions"
      />
      <R_NavItem
        active={activeNavTabId === "log"}
        onClick={() => swicthTab("log")}
        iconId="text-box"
        title="Log"
      />
      <R_NavItem
        active={activeNavTabId === "extras"}
        onClick={() => swicthTab("extras")}
        iconId="dots-horizontal"
        title="Extras"
      />
    </motion.nav>
  );
}
