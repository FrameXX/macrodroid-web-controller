import { forwardRef } from "react";
import { Random } from "../../modules/random";
import "./MultiLineStringOption.scss";
import { R_Icon } from "../Icon/Icon";
import { useDefaultProps } from "../../modules/use_default_props";
import { useRandomNumber } from "../../modules/use_random_number";

interface DescribedInputProps {
  iconId?: string;
  required?: boolean;
  ariaDescribedBy?: string;
  maxLength?: number;
  placeholder?: string;
  autoCapitalize?: string;
  onChange: (newValue: string) => void;
  value?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  description?: React.ReactNode;
  title: string;
  hidden?: boolean;
}

const defaultProps: Partial<DescribedInputProps> = {
  hidden: false,
};

export const R_MultiLineStringOption = forwardRef<
  HTMLTextAreaElement,
  DescribedInputProps
>((requiredProps, ref) => {
  const props = useDefaultProps(requiredProps, defaultProps);

  const id = useRandomNumber(Random.id);

  return (
    <label
      hidden={props.hidden}
      title={props.title}
      className="multi-line-string-option"
    >
      <h3>{props.title}</h3>
      <div className="input-container">
        {props.iconId && <R_Icon iconId={props.iconId} />}
        <textarea
          rows={4}
          title={props.title}
          ref={ref}
          onKeyUp={props.onKeyUp}
          value={props.value}
          onChange={(event) => {
            props.onChange(event.target.value);
          }}
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
