import useDefaultProps from "../../modules/use_default_props";
import R_Icon from "../Icon/Icon";
import "./FAB.scss";

interface FABProps {
  onClick: () => any;
  left?: boolean;
  iconId: string;
  title: string;
}

const defaultProps: Partial<FABProps> = { left: false };

export default function R_FAB(props: FABProps) {
  const usedProps = useDefaultProps(props, defaultProps);
  return (
    <button
      type="button"
      title={usedProps.title}
      onClick={usedProps.onClick}
      className={`fab ${usedProps.left ? "left" : "right"}`}
    >
      <R_Icon iconId={usedProps.iconId} />
    </button>
  );
}
