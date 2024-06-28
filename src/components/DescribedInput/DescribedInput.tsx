import { ReactNode, forwardRef } from "react";
import { Random } from "../../modules/random";
import "./DescribedInput.scss";
import R_Icon from "../Icon/Icon";

interface DescribedInputProps {
  iconId?: string;
  pattern?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  ariaDescribedBy?: string;
  maxLength?: number;
  placeholder?: string;
  autoCapitalize?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  description: ReactNode;
}

const R_DescribedInput = forwardRef<HTMLInputElement, DescribedInputProps>(
  (props, ref) => {
    const id = Random.id();
    return (
      <div className="described-input">
        <div className="input-container">
          {props.iconId && <R_Icon iconId={props.iconId} />}
          <input
            ref={ref}
            onKeyUp={props.onKeyUp}
            value={props.value}
            onChange={props.onChange}
            pattern={props.pattern}
            maxLength={props.maxLength}
            required={props.required}
            type={props.type}
            placeholder={props.placeholder}
            autoCapitalize={props.autoCapitalize}
            aria-describedby={`input-description-${id}`}
          />
        </div>
        <div id={`input-description-${id}`} className="description">
          {props.description}
        </div>
      </div>
    );
  },
);

export default R_DescribedInput;
