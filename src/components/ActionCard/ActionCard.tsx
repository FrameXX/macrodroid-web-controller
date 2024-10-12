import { R_Icon } from "../Icon/Icon";
import "./ActionCard.scss";

interface ActionCardProps {
  name: string;
  iconId: string;
  onClick?: () => void;
}

export function R_ActionCard(props: ActionCardProps) {
  return (
    <button
      onClick={props.onClick}
      title={props.name}
      className="action-card"
    >
      <R_Icon iconId={props.iconId} />
      {props.name}
    </button>
  );
}
