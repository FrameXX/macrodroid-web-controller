import R_Icon from "../Icon/Icon";
import "./ActionCard.scss";

interface ActionCardProps {
  name: string;
  iconId: string;
}

export default function R_ActionCard(props: ActionCardProps) {
  return (
    <button type="button" className="action-card">
      <R_Icon iconId={props.iconId} />
      {props.name}
    </button>
  );
}
