import { PropsWithChildren } from "react";
import "./ExpandableCategory.scss";
import { R_Accordion } from "../Accordion/Accordion";
import { R_Icon } from "../Icon/Icon";
import { useImmer } from "use-immer";
import { R_GenericCard } from "../GenericCard/GenericCard";

interface CategoryProps extends PropsWithChildren {
  name: string;
  iconId: string;
  defaultOpen?: boolean;
}

export function R_ExpandableCategory(props: CategoryProps) {
  const defaultOpen = props.defaultOpen ? props.defaultOpen : false;
  const [open, setOpen] = useImmer(defaultOpen);

  return (
    <div className="expandable-category">
      <R_GenericCard
        button
        onClick={() => setOpen(!open)}
        title={props.name}
        iconId={props.iconId}
        className="head"
        leftBox={<R_Icon upsideDown={open} iconId="chevron-down"></R_Icon>}
      >
        <h2>{props.name}</h2>
      </R_GenericCard>
      <R_Accordion className="content" open={open}>
        {props.children}
      </R_Accordion>
    </div>
  );
}
