import { PropsWithChildren } from "react";
import defaultSourceFilePath from "../../assets/img/icons.svg";
import useDefaultProps from "../../modules/use_default_props";
import "./Icon.scss";
import { TargetAndTransition, motion } from "framer-motion";

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

/**
 * Renders an SVG icon based on the provided props.
 *
 * @param {IconProps} props - The props for the icon component.
 * @param {string} props.iconId - The ID of the icon to render.
 * @param {boolean} [props.side] - Whether the icon should be displayed on the side. Defaults to false.
 * @param {string} [props.sourceFilePath] - The path to the SVG file containing the icon. Defaults to the default source file path.
 * @return {JSX.Element} The rendered SVG icon.
 */
export default function R_Icon(props: IconProps) {
  const usedProps = useDefaultProps(props, defaultProps);
  const href = `${usedProps.sourceFilePath}#${usedProps.iconId}`;
  const animate: TargetAndTransition = {
    width: props.hidden ? 0 : "var(--icon-size)",
    transform: `rotate(${usedProps.upsideDown ? 180 : 0}deg)`,
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
