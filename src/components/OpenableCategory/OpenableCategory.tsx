import { R_Icon } from "../Icon/Icon";
import "./OpenableCategory.scss";

interface OpenableCategoryProps {
  name: string;
  iconId: string;
  onClick: () => void;
}

export function R_OpenableCategory(props: OpenableCategoryProps) {
  return (
    <button
      title={`Open ${props.name}`}
      onClick={props.onClick}
      className="openable-category"
    >
      <R_Icon iconId={props.iconId} />
      <h2>{props.name}</h2>
      <R_Icon iconId="arrow-right-thick" />
    </button>
  );
}
