import R_Icon from "../Icon/Icon";
import useDefaultProps from "../../modules/use_default_props";
import "./Button.scss";
import { Target, motion } from "framer-motion";

interface ButtonProps {
  id?: string;
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

export default function R_Button(requiredProps: ButtonProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  const animate: Target = {
    gap: props.text ? "4px" : undefined,
    paddingRight: props.text ? "12px" : undefined,
    aspectRatio: props.text ? undefined : "1",
  };

  return (
    <motion.button
      id={requiredProps.id}
      hidden={props.hidden}
      animate={animate}
      type="button"
      title={props.title}
      className={`button ${props.noBackground ? "no-background" : ""}`}
      onClick={props.onClick}
    >
      <R_Icon upsideDown={props.iconUpsideDown} iconId={props.iconId} />
      <div>{props.text}</div>
    </motion.button>
  );
}
