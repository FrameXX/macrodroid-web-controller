import R_NavItem from "../NavItem/NavItem";
import "./Nav.scss";
import { TargetAndTransition, motion } from "framer-motion";
import useInnerSize from "../../modules/use_inner_size";

export enum NavTabId {
  CONNECTIONS,
  ACTIONS,
  LOG,
  EXTRAS,
}

interface NavProps {
  activeNavTabId: NavTabId;
  onTabSwitch: (newNavTabId: NavTabId) => any;
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
  function swicthTab(newId: NavTabId) {
    props.onTabSwitch(newId);
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
        active={props.activeNavTabId === NavTabId.CONNECTIONS}
        onClick={() => swicthTab(NavTabId.CONNECTIONS)}
        iconId="transit-connection-variant"
        title="Connections"
      />
      <R_NavItem
        active={props.activeNavTabId === NavTabId.ACTIONS}
        onClick={() => swicthTab(NavTabId.ACTIONS)}
        iconId="play"
        title="Actions"
      />
      <R_NavItem
        active={props.activeNavTabId === NavTabId.LOG}
        onClick={() => swicthTab(NavTabId.LOG)}
        iconId="text-box"
        title="Log"
      />
      <R_NavItem
        active={props.activeNavTabId === NavTabId.EXTRAS}
        onClick={() => swicthTab(NavTabId.EXTRAS)}
        iconId="dots-horizontal"
        title="Extras"
      />
    </motion.nav>
  );
}
