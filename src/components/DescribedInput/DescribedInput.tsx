import { ReactNode, Ref, forwardRef } from "react";
import { Random } from "../../modules/random";
import "./DescribedInput.scss";

interface DescribedInputProps {
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
        <div id={`input-description-${id}`} className="description">
          {props.description}
        </div>
      </div>
    );
  },
);

export default R_DescribedInput;
