import { ReactNode } from "react";
import "./WizardNavigatorIndicator.scss";

interface WizardNavigatorIndicatorProps {
  pageCount: number;
  activePageIndex: number;
}

export default function R_WizardNavigatorIndicator(
  props: WizardNavigatorIndicatorProps,
) {
  if (props.activePageIndex < 0 || props.activePageIndex >= props.pageCount)
    throw new RangeError("Active page index does not match page count.");

  let dots: ReactNode[] = [];
  for (let i = 0; i < props.pageCount; i++) {
    dots.push(
      <div
        key={i}
        className={`dot ${i === props.activePageIndex ? "active" : ""}`}
      />,
    );
  }
  return <div className="wizard-navigator-indicator">{dots}</div>;
}
