import R_Checkbox from "../Checkbox/Checkbox";
import R_Icon from "../Icon/Icon";
import "./BooleanOption.scss";

interface BooleanOptionProps {
  title: string;
  onChange: (newValue: boolean) => void;
  iconId?: string;
  value?: boolean;
}

export default function R_BooleanOption(props: BooleanOptionProps) {
  return (
    <label title={props.title} className="boolean-option">
      {props.iconId && <R_Icon iconId={props.iconId} />}
      <h3>{props.title}</h3>
      <R_Checkbox
        title={props.title}
        value={props.value}
        onChange={props.onChange}
      />
    </label>
  );
}
