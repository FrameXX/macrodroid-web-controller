import { motion, Target } from "framer-motion";
import "./StatusCard.scss";
import { R_Icon } from "../Icon/Icon";

export enum StatusCardState {
  Bad,
  Neutral,
  Good,
}

interface StatusCardProps extends React.PropsWithChildren {
  iconId: string;
  state: StatusCardState;
}

export function R_StatusCard(props: StatusCardProps) {
  function getBorderColor() {
    switch (props.state) {
      case StatusCardState.Bad:
        return "var(--color-accent-trigger)";
      case StatusCardState.Neutral:
        return "var(--color-accent-action)";
      case StatusCardState.Good:
        return "var(--color-accent-constraint)";
      default:
        throw new TypeError("Invalid StatusCardState.");
    }
  }

  const animate: Target = { borderColor: getBorderColor() };

  return (
    <motion.div animate={animate} className="status-card">
      {props.iconId && <R_Icon iconId={props.iconId} side />}
      <div>{props.children}</div>
    </motion.div>
  );
}
