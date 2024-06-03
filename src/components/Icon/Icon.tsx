import { PropsWithChildren } from "react";
import defaultSourceFilePath from "../../assets/img/icons.svg";
import useDefaultProps from "../../modules/use_default_props";
import "./Icon.scss";

interface IconProps extends PropsWithChildren<any> {
  iconId: string;
  big?: boolean;
  side?: boolean;
  sourceFilePath?: string;
}

const defaultProps: Partial<IconProps> = {
  sourceFilePath: defaultSourceFilePath,
  big: false,
  side: false,
};

export default function R_Icon(props: IconProps) {
  const usedProps = useDefaultProps(props, defaultProps);
  const href = `${usedProps.sourceFilePath}#${usedProps.iconId}`;
  return (
    <svg
      className={`icon ${usedProps.big ? "big" : ""} ${usedProps.side ? "side" : ""}`}
    >
      <use aria-hidden href={href} />
    </svg>
  );
}
