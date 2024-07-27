import { Random } from "../../modules/random";
import { useDefaultProps } from "../../modules/use_default_props";
import { useRandomNumber } from "../../modules/use_random_number";
import { R_Icon } from "../Icon/Icon";
import "./NumberOption.scss";

interface BooleanOptionProps {
  title: string;
  onChange: (newValue: number) => void;
  iconId?: string;
  step?: React.InputHTMLAttributes<HTMLInputElement>["step"];
  value?: number;
  hidden?: boolean;
  description?: React.ReactNode;
}

const defaultProps: Partial<BooleanOptionProps> = {
  hidden: false,
};

export function R_NumberOption(requiredProps: BooleanOptionProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  const id = useRandomNumber(Random.id);

  return (
    <label hidden={props.hidden} title={props.title} className="integer-option">
      {props.iconId && <R_Icon iconId={props.iconId} />}
      <h3>{props.title}</h3>
      <input
        value={props.value}
        placeholder={props.title}
        title={props.title}
        onChange={(event) => props.onChange(+event.target.value)}
        type="number"
        step={props.step}
      />
      {props.description && (
        <div id={`input-description-${id}`} className="description">
          {props.description}
        </div>
      )}
    </label>
  );
}
