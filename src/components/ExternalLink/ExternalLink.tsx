import { R_Icon } from "../Icon/Icon";
import "./ExternalLink.scss";

interface ExternalLinkProps extends React.PropsWithChildren {
  href: string;
  iconId: string;
  title: string;
  download?: string | boolean;
}

export function R_ExternalLink(props: ExternalLinkProps) {
  const target = props.download ? undefined : "_blank";

  return (
    <a
      title={props.title}
      className="external-link"
      href={props.href}
      target={target}
      rel="noopener"
      download={props.download}
    >
      <R_Icon iconId={props.iconId} />
      <div className="content">{props.children}</div>
      <R_Icon iconId="open-in-new" />
    </a>
  );
}
