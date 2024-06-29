import { ReactNode, forwardRef } from "react";
import { Random } from "../../modules/random";
import "./MultiLineStringOption.scss";
import R_Icon from "../Icon/Icon";

interface DescribedInputProps {
  iconId?: string;
  required?: boolean;
  ariaDescribedBy?: string;
  maxLength?: number;
  placeholder?: string;
  autoCapitalize?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  description?: ReactNode;
  title: string;
}

const R_MultiLineStringOption = forwardRef<
  HTMLTextAreaElement,
  DescribedInputProps
>((props, ref) => {
  const id = Random.id();
  return (
    <label title={props.title} className="multi-line-string-option">
      <h3>{props.title}</h3>
      <div className="input-container">
        {props.iconId && <R_Icon iconId={props.iconId} />}
        <textarea
          title={props.title}
          ref={ref}
          onKeyUp={props.onKeyUp}
          value={props.value}
          onChange={props.onChange}
          maxLength={props.maxLength}
          required={props.required}
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
});

export default R_MultiLineStringOption;
