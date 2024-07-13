import { R_GenericCard } from "../GenericCard/GenericCard";
import { R_Icon } from "../Icon/Icon";
import "./OpenableCategory.scss";

interface OpenableCategoryProps {
  name: string;
  iconId: string;
  onCLick: () => void;
}

export function R_OpenableCategory(props: OpenableCategoryProps) {
  return (
    <R_GenericCard
      title={props.name}
      iconId={props.iconId}
      button
      onClick={props.onCLick}
      className="openable-category"
      leftBox={<R_Icon iconId="arrow-right-thick" />}
    >
      <h2>{props.name}</h2>
    </R_GenericCard>
  );
}
