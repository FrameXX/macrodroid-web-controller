import { ReactNode, forwardRef, useMemo } from "react";
import { Random } from "../../modules/random";
import "./StringOption.scss";
import { R_Icon } from "../Icon/Icon";
import { useDefaultProps } from "../../modules/use_default_props";

interface DescribedInputProps {
  iconId?: string;
  pattern?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  ariaDescribedBy?: string;
  maxLength?: number;
  placeholder?: string;
  autoCapitalize?: string;
  onChange: (newValue: string, validity: boolean) => void;
  value?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  description?: ReactNode;
  title: string;
  hidden?: boolean;
}

const defaultProps: Partial<DescribedInputProps> = {
  hidden: false,
};

export const R_StringOption = forwardRef<HTMLInputElement, DescribedInputProps>(
  (requiredProps, ref) => {
    const props = useDefaultProps(requiredProps, defaultProps);

    const id = useMemo(() => Random.id(), []);
    return (
      <label
        hidden={props.hidden}
        title={props.title}
        className="string-option"
      >
        <h3>{props.title}</h3>
        <div className="input-container">
          {props.iconId && <R_Icon iconId={props.iconId} />}
          <input
            title={props.title}
            ref={ref}
            onKeyUp={props.onKeyUp}
            value={props.value}
            onChange={(event) => {
              props.onChange(event.target.value, event.target.validity.valid);
            }}
            pattern={props.pattern}
            maxLength={props.maxLength}
            required={props.required}
            type={props.type}
            placeholder={props.placeholder}
            autoCapitalize={props.autoCapitalize}
            aria-describedby={`input-description-${id}`}
          />
        </div>
        {props.description && (
          <div id={`input-description-${id}`} className="description">
            {props.description}
          </div>
        )}
      </label>
    );
  },
);
