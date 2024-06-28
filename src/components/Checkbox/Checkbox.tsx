import { useEffect } from "react";
import { useImmer } from "use-immer";
import "./Checkbox.scss";

interface CheckboxProps {
  title: string;
  value?: boolean;
  onChange: (newValue: boolean) => void;
}

export default function R_Checkbox(props: CheckboxProps) {
  const [value, setValue] = useImmer(props.value || false);

  useEffect(() => {
    setValue(props.value || false);
  }, [props.value]);

  function toggle() {
    setValue(!value);
    props.onChange(!value);
  }

  return (
    <button
      type="button"
      title={props.title}
      className={`checkbox ${value ? "checked" : "unchecked"}`}
      onClick={toggle}
      role="checkbox"
    >
      <svg
        className="icon-checked"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
      </svg>
      <svg
        className="icon-unchecked"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
      </svg>
    </button>
  );
}
