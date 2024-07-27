import { useDefaultProps } from "../../modules/use_default_props";
import "./WarningCard.scss";
import { R_Accordion } from "../Accordion/Accordion";
import { R_Icon } from "../Icon/Icon";

interface WarningCardProps extends React.PropsWithChildren {
  hidden?: boolean;
}

const defaultProps: Partial<WarningCardProps> = {
  hidden: false,
};

export function R_WarningCard(requiredProps: WarningCardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  return (
    <R_Accordion open={!props.hidden}>
      <div className="warning-card">
        <R_Icon iconId="alert" />
        <div>{props.children}</div>
      </div>
    </R_Accordion>
  );
}
