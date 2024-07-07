import { PropsWithChildren } from "react";
import "./TitleWithIcon.scss";
import { R_Icon } from "../Icon/Icon";

interface TitleWithIconProps extends PropsWithChildren {
  iconId: string;
}

export function R_TitleWithIcon(props: TitleWithIconProps) {
  return (
    <div className="title-with-icon">
      <R_Icon side iconId={props.iconId} />
      {props.children}
    </div>
  );
}
