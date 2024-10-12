import defaultSourceFilePath from "../../assets/img/icons.svg";
import { useDefaultProps } from "../../modules/use_default_props";

interface IconProps extends React.PropsWithChildren {
  iconId: string;
  side?: boolean;
  sourceFilePath?: string;
  onClick?: () => void;
  hidden?: boolean;
  upsideDown?: boolean;
  className?: string;
}

const defaultProps: Partial<IconProps> = {
  sourceFilePath: defaultSourceFilePath,
  side: false,
  hidden: false,
  upsideDown: false,
};

export function R_Icon(requiredProps: IconProps) {
  const props = useDefaultProps(requiredProps, defaultProps);
  const href = `${props.sourceFilePath}#${props.iconId}`;
  return (
    <svg
      aria-hidden
      onClick={props.onClick}
      role="img"
      className={`icon ${props.side ? "side" : ""} ${props.hidden ? "hidden" : ""} ${props.className || ""}`}
    >
      <use href={href} />
    </svg>
  );
}
