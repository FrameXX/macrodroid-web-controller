import { PropsWithChildren } from "react";
import R_Icon from "../Icon/Icon";
import useDefaultProps from "../../modules/use_default_props";
import "./Button.scss";

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  iconId: string;
  title: string;
  childrenHidden?: boolean;
  noBackground?: boolean;
  upsideDown?: boolean;
}

const defaultProps: Partial<ButtonProps> = {
  childrenHidden: false,
  noBackground: false,
  upsideDown: false,
};

export default function R_Button(props: ButtonProps) {
  const usedProps = useDefaultProps(props, defaultProps);
  return (
    <button
      type="button"
      title={usedProps.title}
      className={`button ${usedProps.noBackground ? "no-background" : ""}`}
      onClick={usedProps.onClick}
    >
      <R_Icon iconId={usedProps.iconId} />
      <div>{usedProps.children}</div>
    </button>
  );
}
