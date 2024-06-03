import { useState } from "react";
import R_NavItem from "../NavItem/NavItem";
import "./Nav.scss";

export type NavTabId = "devices" | "actions" | "log" | "extras";

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
  { id: "devices", title: "Devices", iconId: "devices" },
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

  return (
    <nav>
      {navTabs.map((tab) => (
        <R_NavItem
          key={tab.id}
          active={activeNavTabId === tab.id}
          onClick={() => swicthTab(tab.id)}
          navTab={tab}
        />
      ))}
    </nav>
  );
}
