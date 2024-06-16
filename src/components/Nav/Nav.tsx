import R_NavItem from "../NavItem/NavItem";
import "./Nav.scss";
import { Target, motion } from "framer-motion";
import useInnerSize from "../../modules/use_inner_size";

export enum NavTabId {
  Connections,
  Actions,
  Log,
  Extras,
}

interface NavProps {
  activeNavTabId: NavTabId;
  onTabSwitch: (newNavTabId: NavTabId) => void;
}

export default function R_Nav(props: NavProps) {
  function swicthTab(newId: NavTabId) {
    props.onTabSwitch(newId);
  }

  const wideScreen = useInnerSize();

  const animate: Target = wideScreen
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
        overflowY: "hidden",
      };

  return (
    <motion.nav layout animate={animate}>
      <R_NavItem
        active={props.activeNavTabId === NavTabId.Connections}
        onClick={() => swicthTab(NavTabId.Connections)}
        iconId="transit-connection-variant"
        title="Connections"
      />
      <R_NavItem
        active={props.activeNavTabId === NavTabId.Actions}
        onClick={() => swicthTab(NavTabId.Actions)}
        iconId="play"
        title="Actions"
      />
      <R_NavItem
        active={props.activeNavTabId === NavTabId.Log}
        onClick={() => swicthTab(NavTabId.Log)}
        iconId="text-box"
        title="Log"
      />
      <R_NavItem
        active={props.activeNavTabId === NavTabId.Extras}
        onClick={() => swicthTab(NavTabId.Extras)}
        iconId="dots-horizontal"
        title="Extras"
      />
    </motion.nav>
  );
}
