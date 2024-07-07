import { ReactNode, forwardRef } from "react";
import { Random } from "../../modules/random";
import "./StringOption.scss";
import { R_Icon } from "../Icon/Icon";

interface DescribedInputProps {
  iconId?: string;
  pattern?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  ariaDescribedBy?: string;
  maxLength?: number;
  placeholder?: string;
  autoCapitalize?: string;
  onChange?: (newValue: string, validity: boolean) => void;
  value?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  description?: ReactNode;
  title: string;
}

export const R_StringOption = forwardRef<HTMLInputElement, DescribedInputProps>(
  (props, ref) => {
    const id = Random.id();
    return (
      <label title={props.title} className="string-option">
        <h3>{props.title}</h3>
        <div className="input-container">
          {props.iconId && <R_Icon iconId={props.iconId} />}
          <input
            title={props.title}
            ref={ref}
            onKeyUp={props.onKeyUp}
            value={props.value}
            onChange={(event) => {
              if (props.onChange)
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
