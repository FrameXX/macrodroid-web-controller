import { PropsWithChildren } from "react";
import { R_GenericCard } from "../GenericCard/GenericCard";
import { R_Icon } from "../Icon/Icon";
import "./ExternalLink.scss";

interface ExternalLinkProps extends PropsWithChildren {
  href: string;
  iconId: string;
  title: string;
  download?: string | boolean;
}

export function R_ExternalLink(props: ExternalLinkProps) {
  const target = props.download ? undefined : "_blank";

  return (
    <a
      className="external-link"
      href={props.href}
      target={target}
      download={props.download}
    >
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
