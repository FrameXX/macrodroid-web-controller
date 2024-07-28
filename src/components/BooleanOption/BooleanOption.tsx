import { Random } from "../../modules/random";
import { useDefaultProps } from "../../modules/use_default_props";
import { useRandomNumber } from "../../modules/use_random_number";
import { R_Checkbox } from "../Checkbox/Checkbox";
import { R_Icon } from "../Icon/Icon";
import "./BooleanOption.scss";

interface BooleanOptionProps {
  title: string;
  onChange: (newValue: boolean) => void;
  iconId?: string;
  value?: boolean;
  hidden?: boolean;
  description?: React.ReactNode;
}

const defaultProps: Partial<BooleanOptionProps> = {
  hidden: false,
};

export function R_BooleanOption(requiredProps: BooleanOptionProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  const id = useRandomNumber(Random.id);

  return (
    <label
      hidden={props.hidden}
      title={props.title}
      className="option boolean-option"
    >
      {props.iconId && <R_Icon iconId={props.iconId} />}
      <div className="title">{props.title}</div>
      <R_Checkbox
        title={props.title}
        value={props.value}
        onChange={props.onChange}
      />
      {props.description && (
        <div id={`input-description-${id}`} className="description">
          {props.description}
        </div>
      )}
    </label>
  );
}
