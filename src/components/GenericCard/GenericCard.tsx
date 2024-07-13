import React, { PropsWithChildren } from "react";
import "./GenericCard.scss";
import { R_Icon } from "../Icon/Icon";
import { useDefaultProps } from "../../modules/use_default_props";
import { R_Accordion } from "../Accordion/Accordion";

interface ItemCardProps extends PropsWithChildren {
  iconId?: string;
  className?: string;
  hidden?: boolean;
  button?: boolean;
  onClick?: () => void;
  leftBox?: React.ReactNode;
  title?: string;
}

const defaultProps: Partial<ItemCardProps> = {
  hidden: false,
  button: false,
};

export function R_GenericCard(requiredProps: ItemCardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);

  const content = (
    <>
      {props.iconId && <R_Icon iconId={props.iconId} />}
      <div className="main">{props.children}</div>
      {props.leftBox}
    </>
  );

  const cardClassName = `generic-card ${props.className ? props.className : ""}`;

  const card = props.button ? (
    <button
      type="button"
      title={props.title}
      onClick={props.onClick}
      className={cardClassName}
    >
      {content}
    </button>
  ) : (
    <div title={props.title} className={cardClassName}>
      {content}
    </div>
  );

  return <R_Accordion open={!props.hidden}>{card}</R_Accordion>;
}
