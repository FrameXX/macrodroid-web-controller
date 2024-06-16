import { ReactNode } from "react";
import "./Wizard.scss";
import { Target, motion } from "framer-motion";
import R_WizardNavigator from "../WizardNavigator/WizardNavigator";
import { DEFAULT_TRANSITION_OFFSET } from "../../modules/const";

interface WizardProps {
  open: boolean;
  pages: ReactNode[];
  activePageIndex: number;
  leftButton: ReactNode;
  rightButton: ReactNode;
  id?: string;
}

export default function R_Wizard(props: WizardProps) {
  const pageCount = props.pages.length;
  if (props.activePageIndex < 0 || props.activePageIndex >= pageCount)
    throw new RangeError("Active page index does not match page count.");

  const animate: Target = props.open
    ? {}
    : { x: DEFAULT_TRANSITION_OFFSET, opacity: 0, display: "none" };

  function animatePage(index: number): Target {
    if (index < props.activePageIndex) {
      return {
        display: "none",
        x: -DEFAULT_TRANSITION_OFFSET,
        opacity: 0,
      };
    } else if (index > props.activePageIndex) {
      return {
        display: "none",
        x: DEFAULT_TRANSITION_OFFSET,
        opacity: 0,
      };
    } else {
      return {};
    }
  }

  return (
    <motion.div id={props.id} animate={animate} className="wizard">
      {props.pages.map((page, index) => (
        <motion.div key={index} className="page" animate={animatePage(index)}>
          {page}
          <div className="navigator-placeholder" />
        </motion.div>
      ))}
      <R_WizardNavigator
        pageCount={pageCount}
        activePageIndex={props.activePageIndex}
        leftButton={props.leftButton}
        rightButton={props.rightButton}
      />
    </motion.div>
  );
}
