import { ReactNode } from "react";
import { R_WizardNavigatorIndicator } from "../WizardNavigatorIndicator/WizardNavigatorIndicator";
import "./WizardNavigator.scss";
import { useDefaultProps } from "../../modules/use_default_props";

interface WizardNavigatorProps {
  leftButton: ReactNode;
  rightButton: ReactNode;
  pageCount: number;
  activePageIndex: number;
  hideIndicator?: boolean;
}

const defaultProps: Partial<WizardNavigatorProps> = {
  hideIndicator: false,
};

export function R_WizardNavigator(requiredProps: WizardNavigatorProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  return (
    <div className="wizard-navigator">
      <div className="filler">{props.leftButton}</div>
      <R_WizardNavigatorIndicator
        hidden={props.hideIndicator}
        pageCount={props.pageCount}
        activePageIndex={props.activePageIndex}
      />
      <div className="filler">{props.rightButton}</div>
    </div>
  );
}
