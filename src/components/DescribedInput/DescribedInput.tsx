import { ReactNode } from "react";
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

export default function R_DescribedInput(props: DescribedInputProps) {
  const id = Random.id();
  return (
    <div className="described-input">
      <input
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
}
