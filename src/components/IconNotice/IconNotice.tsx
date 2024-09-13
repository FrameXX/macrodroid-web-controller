import { R_Icon } from "../Icon/Icon";
import "./IconNotice.scss";
import { useDefaultProps } from "../../modules/use_default_props";
import { R_Accordion } from "../Accordion/Accordion";

interface IconNoticeProps {
  hidden?: boolean;
  iconId?: string;
  title: string;
  description?: string;
}

const defaultProps: Partial<IconNoticeProps> = {
  hidden: false,
  iconId: "emoticon-cry",
};

export function R_IconNotice(requiredProps: IconNoticeProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  return (
    <R_Accordion open={!props.hidden}>
      <div className="icon-notice">
        <R_Icon iconId={props.iconId} />
        <h3>{props.title}</h3>
        {props.description}
      </div>
    </R_Accordion>
  );
}
