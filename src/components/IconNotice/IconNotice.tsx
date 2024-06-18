import { PropsWithChildren } from "react";
import R_Icon from "../Icon/Icon";
import "./IconNotice.scss";
import useDefaultProps from "../../modules/use_default_props";

interface IconNoticeProps extends PropsWithChildren {
  hidden?: boolean;
  iconId?: string;
}

const defaultProps: Partial<IconNoticeProps> = {
  hidden: false,
  iconId: "emoticon-cry",
};

export default function R_IconNotice(props: IconNoticeProps) {
  const usedProps = useDefaultProps(props, defaultProps);

  return (
    <div hidden={usedProps.hidden} className="icon-notice">
      <R_Icon iconId={usedProps.iconId} />
      {props.children}
    </div>
  );
}
