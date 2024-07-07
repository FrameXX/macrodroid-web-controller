import { ReactNode } from "react";
import "./WizardNavigatorIndicator.scss";
import { Target, motion } from "framer-motion";
import { useDefaultProps } from "../../modules/use_default_props";

interface WizardNavigatorIndicatorProps {
  hidden?: boolean;
  pageCount: number;
  activePageIndex: number;
}

const defaultProps: Partial<WizardNavigatorIndicatorProps> = {
  hidden: false,
};

export function R_WizardNavigatorIndicator(
  requiredProps: WizardNavigatorIndicatorProps,
) {
  const props = useDefaultProps(requiredProps, defaultProps);

  if (props.activePageIndex < 0 || props.activePageIndex >= props.pageCount)
    throw new RangeError("Active page index does not match page count.");

  const dots: ReactNode[] = [];
  for (let i = 0; i < props.pageCount; i++) {
    const active = i === props.activePageIndex;
    const animate: Target = active
      ? { scale: 1.2, opacity: 1 }
      : { opacity: 0.3 };
    dots.push(<motion.div animate={animate} key={i} className="dot" />);
  }
  return (
    <div hidden={props.hidden} className="wizard-navigator-indicator">
      {dots}
    </div>
  );
}
