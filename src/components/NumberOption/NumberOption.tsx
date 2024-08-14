import { Random } from "../../modules/random";
import { useDefaultProps } from "../../modules/use_default_props";
import { useRandomNumber } from "../../modules/use_random_number";
import { R_Icon } from "../Icon/Icon";

interface BooleanOptionProps {
  title: string;
  onChange: (newValue: number) => void;
  iconId?: string;
  decimal?: boolean;
  value?: number;
  hidden?: boolean;
  description?: React.ReactNode;
  required?: boolean;
}

const defaultProps: Partial<BooleanOptionProps> = {
  hidden: false,
  required: false,
  decimal: false,
};

export function R_NumberOption(requiredProps: BooleanOptionProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  const id = useRandomNumber(Random.id);

  return (
    <label
      hidden={props.hidden}
      title={props.title}
      className="option simple-option"
    >
      <div>
        {props.iconId && <R_Icon iconId={props.iconId} />}
        <div className="title">{props.title}</div>
        <input
          value={props.value}
          placeholder={props.title}
          title={props.title}
          onChange={(event) => props.onChange(+event.target.value)}
          type="number"
          step={props.decimal ? "any" : 1}
          required={props.required}
        />
      </div>
      {props.description && (
        <div id={`input-description-${id}`} className="description">
          {props.description}
        </div>
      )}
    </label>
  );
}
