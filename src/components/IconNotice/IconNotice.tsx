import { PropsWithChildren } from "react";
import { R_Icon } from "../Icon/Icon";
import "./IconNotice.scss";
import { useDefaultProps } from "../../modules/use_default_props";
import { R_Accordion } from "../Accordion/Accordion";

interface IconNoticeProps extends PropsWithChildren {
  hidden?: boolean;
  iconId?: string;
}

const defaultProps: Partial<IconNoticeProps> = {
  hidden: false,
  iconId: "emoticon-cry",
};

export function R_IconNotice(requiredProps: IconNoticeProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  return (
    <R_Accordion openHeight={350} open={!props.hidden} className="icon-notice">
      <R_Icon iconId={props.iconId} />
      {requiredProps.children}
    </R_Accordion>
  );
}
