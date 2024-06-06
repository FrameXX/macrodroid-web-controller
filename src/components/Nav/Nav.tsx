import { useState } from "react";
import R_NavItem from "../NavItem/NavItem";
import "./Nav.scss";
import { TargetAndTransition, motion } from "framer-motion";
import useWideScreen from "../../modules/useWideScreen";

export type NavTabId = "connections" | "actions" | "log" | "extras";

interface NavProps {
  navTabId: NavTabId;
  onTabSwitch?: (newNavTabId: NavTabId) => any;
}

export default function R_Nav(props: NavProps) {
  const [activeNavTabId, setActiveNavTabId] = useState<NavTabId>(
    props.navTabId,
  );

  function swicthTab(newId: NavTabId) {
    setActiveNavTabId(newId);
    if (props.onTabSwitch) props.onTabSwitch(newId);
  }

  const wideScreen = useWideScreen();

  const animate: TargetAndTransition = wideScreen
    ? { right: 0, justifyContent: "space-evenly", width: "100%", height: 80 }
    : {
        top: 0,
        flexDirection: "column",
        justifyContent: "start",
        height: "100%",
        width: 125,
      };

  return (
    <motion.nav layout animate={animate}>
      <R_NavItem
        active={activeNavTabId === "connections"}
        onClick={() => swicthTab("connections")}
        iconId="devices"
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
