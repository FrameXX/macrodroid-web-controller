import R_Icon from "../Icon/Icon";
import "./FAB.scss";

interface FABProps {
  onClick: () => any;
  iconId: string;
  title: string;
}

export default function R_FAB(props: FABProps) {
  return (
    <button title={props.title} onClick={props.onClick} className="fab">
      <R_Icon iconId={props.iconId} />
    </button>
  );
}
