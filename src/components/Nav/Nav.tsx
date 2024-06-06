import { useState } from "react";
import R_NavItem from "../NavItem/NavItem";
import "./Nav.scss";
import { TargetAndTransition, motion } from "framer-motion";
import useWideScreen from "../../modules/useWideScreen";

export type NavTabId = "connections" | "actions" | "log" | "extras";

interface NavProps {
  defaultNavTabId: NavTabId;
  onTabSwitch?: (newNavTabId: NavTabId) => any;
}

export interface NavTab {
  id: NavTabId;
  title: string;
  iconId: string;
}

const navTabs: NavTab[] = [
  { id: "connections", title: "Connections", iconId: "devices" },
  { id: "actions", title: "Actions", iconId: "play" },
  { id: "log", title: "Log", iconId: "text-box" },
  { id: "extras", title: "Extras", iconId: "dots-horizontal" },
];

export default function R_Nav(props: NavProps) {
  const [activeNavTabId, setActiveNavTabId] = useState<NavTabId>(
    props.defaultNavTabId,
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
      {navTabs.map((tab) => (
        <R_NavItem
          key={tab.id}
          active={activeNavTabId === tab.id}
          onClick={() => swicthTab(tab.id)}
          navTab={tab}
        />
      ))}
    </motion.nav>
  );
}
