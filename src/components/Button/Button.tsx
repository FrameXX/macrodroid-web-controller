import R_Icon from "../Icon/Icon";
import useDefaultProps from "../../modules/use_default_props";
import "./Button.scss";
import { Target, motion } from "framer-motion";

interface ButtonProps {
  onClick: () => void;
  iconId: string;
  title: string;
  text?: string;
  noBackground?: boolean;
  iconUpsideDown?: boolean;
  hidden?: boolean;
}

const defaultProps: Partial<ButtonProps> = {
  noBackground: false,
  iconUpsideDown: false,
};

export default function R_Button(props: ButtonProps) {
  const usedProps = useDefaultProps(props, defaultProps);

  const animate: Target = {
    gap: usedProps.text ? "4px" : "",
    paddingRight: usedProps.text ? "12px" : "",
    aspectRatio: usedProps.text ? "" : "1",
  };

  return (
    <motion.button
      hidden={usedProps.hidden}
      animate={animate}
      type="button"
      title={usedProps.title}
      className={`button ${usedProps.noBackground ? "no-background" : ""}`}
      onClick={usedProps.onClick}
    >
      <R_Icon upsideDown={usedProps.iconUpsideDown} iconId={usedProps.iconId} />
      <div>{usedProps.text}</div>
    </motion.button>
  );
}
