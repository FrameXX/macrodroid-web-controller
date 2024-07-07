import { ReactNode } from "react";
import { R_WizardNavigatorIndicator } from "../WizardNavigatorIndicator/WizardNavigatorIndicator";
import "./WizardNavigator.scss";

interface WizardNavigatorProps {
  leftButton: ReactNode;
  rightButton: ReactNode;
  pageCount: number;
  activePageIndex: number;
}

export function R_WizardNavigator(props: WizardNavigatorProps) {
  return (
    <div className="wizard-navigator">
      <div className="filler">{props.leftButton}</div>
      <R_WizardNavigatorIndicator
        pageCount={props.pageCount}
        activePageIndex={props.activePageIndex}
      />
      <div className="filler">{props.rightButton}</div>
    </div>
  );
}
