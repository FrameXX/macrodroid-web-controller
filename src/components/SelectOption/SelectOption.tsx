import { R_Icon } from "../Icon/Icon";
import "./SelectOption.scss";

interface SelectOptionProps {
  title: string;
  onChange: (newValue: number) => void;
  iconId?: string;
  options: string[];
}

export function R_SelectOption(props: SelectOptionProps) {
  return (
    <label title={props.title} className="boolean-option">
      {props.iconId && <R_Icon iconId={props.iconId} />}
      <h3>{props.title}</h3>
      <select onChange={(event) => props.onChange(+event.target.value)}>
        {props.options.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
