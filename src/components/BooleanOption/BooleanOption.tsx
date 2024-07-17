import { useDefaultProps } from "../../modules/use_default_props";
import { R_Checkbox } from "../Checkbox/Checkbox";
import { R_Icon } from "../Icon/Icon";
import "./BooleanOption.scss";

interface BooleanOptionProps {
  title: string;
  onChange: (newValue: boolean) => void;
  iconId?: string;
  value?: boolean;
  hidden?: boolean;
}

const defaultProps: Partial<BooleanOptionProps> = {
  hidden: false,
};

export function R_BooleanOption(requiredProps: BooleanOptionProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  return (
    <label hidden={props.hidden} title={props.title} className="boolean-option">
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
