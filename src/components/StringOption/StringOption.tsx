import { forwardRef } from "react";
import { Random } from "../../modules/random";
import { R_Icon } from "../Icon/Icon";
import { useDefaultProps } from "../../modules/use_default_props";
import { useRandomNumber } from "../../modules/use_random_number";

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
  description?: React.ReactNode;
  title: string;
  hidden?: boolean;
}

const defaultProps: Partial<DescribedInputProps> = {
  hidden: false,
};

export const R_StringOption = forwardRef<HTMLInputElement, DescribedInputProps>(
  (requiredProps, ref) => {
    const props = useDefaultProps(requiredProps, defaultProps);

    const id = useRandomNumber(Random.id);

    return (
      <label
        hidden={props.hidden}
        title={props.title}
        className="option string-option"
      >
        {props.iconId && <R_Icon iconId={props.iconId} />}
        <div>
          <div className="title">{props.title}</div>
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
          {props.description && (
            <div id={`input-description-${id}`} className="description">
              {props.description}
            </div>
          )}
        </div>
      </label>
    );
  },
);
