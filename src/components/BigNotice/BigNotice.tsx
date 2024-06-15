import { PropsWithChildren } from "react";
import R_Icon from "../Icon/Icon";
import "./BigNotice.scss";
import useDefaultProps from "../../modules/use_default_props";

interface NothingNoticeProps extends PropsWithChildren {
  hidden?: boolean;
}

const defaultProps: Partial<NothingNoticeProps> = { hidden: false };

export default function R_BigNotice(props: NothingNoticeProps) {
  const usedProps = useDefaultProps(props, defaultProps);

  return (
    <div hidden={usedProps.hidden} className="nothing-notice">
      <R_Icon iconId="emoticon-cry" />
      {props.children}
    </div>
  );
}
