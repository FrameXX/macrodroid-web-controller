import { PropsWithChildren } from "react";
import defaultSourceFilePath from "../../assets/img/icons.svg";
import { useDefaultProps } from "../../modules/use_default_props";
import { Target, motion } from "framer-motion";

interface IconProps extends PropsWithChildren {
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
  const animate: Target = {
    transform: `scaleY(${props.upsideDown ? -1 : 1})`,
  };
  return (
    <motion.svg
      animate={animate}
      onClick={props.onClick}
      role="img"
      className={`icon ${props.side ? "side" : ""} ${props.hidden ? "hidden" : ""} ${props.className || ""}`}
    >
      <use aria-hidden href={href} />
    </motion.svg>
  );
}
