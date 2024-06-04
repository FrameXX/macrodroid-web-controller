import { ReactNode } from "react";
import "./WizardNavigatorIndicator.scss";

interface WizardNavigatorIndicatorProps {
  dotCount: number;
  activeDotIndex: number;
}

export default function R_WizardNavigatorIndicator(
  props: WizardNavigatorIndicatorProps,
) {
  if (props.activeDotIndex < 0 || props.activeDotIndex >= props.dotCount)
    throw new RangeError("Active dot index does not match dot count.");

  let dots: ReactNode[] = [];
  for (let i = 0; i < props.dotCount; i++) {
    dots.push(
      <div
        key={i}
        className={`dot ${i === props.activeDotIndex ? "active" : ""}`}
      />,
    );
  }
  return <div className="wizard-navigator-indicator">{dots}</div>;
}
