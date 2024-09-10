import { R_SimpleCard } from "../SimpleCard/SimpleCard";
import "./StatusCard.scss";

interface StatusCardProps extends React.PropsWithChildren {
  iconId: string;
}

export function R_StatusCard(props: StatusCardProps) {
  return (
    <R_SimpleCard className="status-card" iconId={props.iconId}>
      {props.children}
    </R_SimpleCard>
  );
}
