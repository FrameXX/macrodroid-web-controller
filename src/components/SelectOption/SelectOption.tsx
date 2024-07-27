import { Random } from "../../modules/random";
import { useRandomNumber } from "../../modules/use_random_number";
import { R_Icon } from "../Icon/Icon";
import "./SelectOption.scss";

interface SelectOptionProps {
  title: string;
  onChange: (newValue: number) => void;
  iconId?: string;
  options: string[];
  value?: number;
  description?: React.ReactNode;
}

export function R_SelectOption(props: SelectOptionProps) {
  const id = useRandomNumber(Random.id);

  return (
    <label title={props.title} className="boolean-option">
      {props.iconId && <R_Icon iconId={props.iconId} />}
      <h3>{props.title}</h3>
      <select
        value={props.value}
        onChange={(event) => props.onChange(+event.target.value)}
      >
        {props.options.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
      </select>
      {props.description && (
        <div id={`input-description-${id}`} className="description">
          {props.description}
        </div>
      )}
    </label>
  );
}
