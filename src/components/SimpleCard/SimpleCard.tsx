import { useDefaultProps } from "../../modules/use_default_props";
import { R_Icon } from "../Icon/Icon";
import "./SimpleCard.scss";

interface SimpleCardProps extends React.PropsWithChildren {
  iconId?: string;
  className?: string;
  id?: string;
  hidden?: boolean;
}

const defaultProps: Partial<SimpleCardProps> = {
  hidden: false,
};

export function R_SimpleCard(requiredProps: SimpleCardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  return (
    <div hidden={props.hidden} className={`simple-card ${props.className}`}>
      {props.iconId && <R_Icon iconId={props.iconId} />}
      <div className="content">{props.children}</div>
    </div>
  );
}
