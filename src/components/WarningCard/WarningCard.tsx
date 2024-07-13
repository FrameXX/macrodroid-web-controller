import { PropsWithChildren } from "react";
import { R_GenericCard } from "../GenericCard/GenericCard";
import { useDefaultProps } from "../../modules/use_default_props";
import "./WarningCard.scss";

interface WarningCardProps extends PropsWithChildren {
  hidden?: boolean;
}

const defaultProps: Partial<WarningCardProps> = {
  hidden: false,
};

export function R_WarningCard(requiredProps: WarningCardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  return (
    <R_GenericCard
      className="warning-card"
      hidden={props.hidden}
      iconId="alert"
    >
      {props.children}
    </R_GenericCard>
  );
}
