import { ReactNode } from "react";
import R_WizardNavigatorIndicator from "../WizardNavigatorIndicator/WizardNavigatorIndicator";
import "./WizardNavigator.scss";

interface WizardNavigatorProps {
  leftButton: ReactNode;
  rightButton: ReactNode;
  dotCount: number;
  activeDotIndex: number;
}

export default function R_WizardNavigator(props: WizardNavigatorProps) {
  return (
    <div className="wizard-navigator">
      <div className="filler">{props.leftButton}</div>
      <R_WizardNavigatorIndicator
        dotCount={props.dotCount}
        activeDotIndex={props.activeDotIndex}
      />
      <div className="filler">{props.rightButton}</div>
    </div>
  );
}
