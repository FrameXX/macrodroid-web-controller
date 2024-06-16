import { PropsWithChildren } from "react";
import R_Icon from "../Icon/Icon";
import "./BigNotice.scss";
import useDefaultProps from "../../modules/use_default_props";

interface NothingNoticeProps extends PropsWithChildren {
  hidden?: boolean;
  iconId?: string;
}

const defaultProps: Partial<NothingNoticeProps> = {
  hidden: false,
  iconId: "emoticon-cry",
};

export default function R_BigNotice(props: NothingNoticeProps) {
  const usedProps = useDefaultProps(props, defaultProps);

  return (
    <div hidden={usedProps.hidden} className="nothing-notice">
      <R_Icon iconId={usedProps.iconId} />
      {props.children}
    </div>
  );
}
