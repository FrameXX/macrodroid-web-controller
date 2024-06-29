import R_Icon from "../Icon/Icon";
import "./NumberOption.scss";

interface BooleanOptionProps {
  title: string;
  onChange: (newValue: number) => void;
  iconId?: string;
  step?: React.InputHTMLAttributes<HTMLInputElement>["step"];
}

export default function R_NumberOption(props: BooleanOptionProps) {
  return (
    <label title={props.title} className="integer-option">
      {props.iconId && <R_Icon iconId={props.iconId} />}
      <h3>{props.title}</h3>
      <input
        placeholder={props.title}
        title={props.title}
        onChange={(event) => props.onChange(+event.target.value)}
        type="number"
        step={props.step}
      />
    </label>
  );
}
