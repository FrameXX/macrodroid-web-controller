import { PropsWithChildren } from "react";
import { R_GenericCard } from "../GenericCard/GenericCard";
import { R_Icon } from "../Icon/Icon";
import "./ExternalLink.scss";

interface ExternalLinkProps extends PropsWithChildren {
  href: string;
  iconId: string;
  title: string;
}

export function R_ExternalLink(props: ExternalLinkProps) {
  return (
    <a className="external-link" href={props.href} target="_blank">
      <R_GenericCard
        title={props.title}
        className="external-link"
        iconId={props.iconId}
        leftBox={<R_Icon iconId="open-in-new" />}
      >
        {props.children}
      </R_GenericCard>
    </a>
  );
}
