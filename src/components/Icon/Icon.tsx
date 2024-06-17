import { PropsWithChildren } from "react";
import defaultSourceFilePath from "../../assets/img/icons.svg";
import useDefaultProps from "../../modules/use_default_props";
import "./Icon.scss";
import { Target, motion } from "framer-motion";

interface IconProps extends PropsWithChildren {
  iconId: string;
  side?: boolean;
  sourceFilePath?: string;
  onClick?: () => void;
  hidden?: boolean;
  upsideDown?: boolean;
}

const defaultProps: Partial<IconProps> = {
  sourceFilePath: defaultSourceFilePath,
  side: false,
  hidden: false,
  upsideDown: false,
};

export default function R_Icon(props: IconProps) {
  const usedProps = useDefaultProps(props, defaultProps);
  const href = `${usedProps.sourceFilePath}#${usedProps.iconId}`;
  const animate: Target = {
    width: usedProps.hidden ? 0 : "var(--icon-size)",
    transform: `scaleY(${usedProps.upsideDown ? -1 : 1})`,
    margin: usedProps.hidden ? 0 : "",
    display: usedProps.hidden ? "none" : "block",
  };
  return (
    <motion.svg
      animate={animate}
      onClick={usedProps.onClick}
      role="img"
      className={`icon ${usedProps.side ? "side" : ""}`}
    >
      <use aria-hidden href={href} />
    </motion.svg>
  );
}
