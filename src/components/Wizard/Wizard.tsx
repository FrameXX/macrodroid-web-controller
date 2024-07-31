import "./Wizard.scss";
import { Target, motion } from "framer-motion";
import { R_WizardNavigator } from "../WizardNavigator/WizardNavigator";
import { DEFAULT_TRANSITION_TRANSLATE_PX } from "../../modules/const";
import { useDefaultProps } from "../../modules/use_default_props";

interface WizardProps {
  open: boolean;
  pages: React.ReactNode[];
  activePageIndex: number;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  id?: string;
  hideNavigatorIndicator?: boolean;
  hideNavigatorPlaceholder?: boolean;
  fullscreen?: boolean;
}

const defaultProps: Partial<WizardProps> = {
  hideNavigatorIndicator: false,
  hideNavigatorPlaceholder: false,
  fullscreen: false,
};

export function R_Wizard(requiredProps: WizardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  const pageCount = props.pages.length;
  if (props.activePageIndex < 0 || props.activePageIndex >= pageCount)
    throw new RangeError("Active page index does not match page count.");

  const animate: Target = props.open
    ? {}
    : { x: DEFAULT_TRANSITION_TRANSLATE_PX, opacity: 0, display: "none" };

  function animatePage(index: number): Target {
    if (index < props.activePageIndex) {
      return {
        display: "none",
        x: -DEFAULT_TRANSITION_TRANSLATE_PX,
        opacity: 0,
      };
    } else if (index > props.activePageIndex) {
      return {
        display: "none",
        x: DEFAULT_TRANSITION_TRANSLATE_PX,
        opacity: 0,
      };
    } else {
      return {};
    }
  }

  return (
    <motion.div
      id={props.id}
      animate={animate}
      className={`wizard ${props.fullscreen ? "fullscreen" : ""}`}
    >
      {props.pages.map((page, index) => (
        <motion.div key={index} className="page" animate={animatePage(index)}>
          {page}
          <div
            hidden={props.hideNavigatorPlaceholder}
            className="navigator-placeholder"
          />
        </motion.div>
      ))}
      <R_WizardNavigator
        hideIndicator={props.hideNavigatorIndicator || props.pages.length < 2}
        pageCount={pageCount}
        activePageIndex={props.activePageIndex}
        leftButton={props.leftButton}
        rightButton={props.rightButton}
      />
    </motion.div>
  );
}
