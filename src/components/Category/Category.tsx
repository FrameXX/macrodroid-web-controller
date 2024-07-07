import { PropsWithChildren } from "react";
import "./Category.scss";
import { R_Accordion } from "../Accordion/Accordion";
import { R_Icon } from "../Icon/Icon";
import { useImmer } from "use-immer";

interface CategoryProps extends PropsWithChildren {
  name: string;
  iconId: string;
  defaultOpen?: boolean;
}

export function R_Category(props: CategoryProps) {
  const defaultOpen = props.defaultOpen ? props.defaultOpen : false;
  const [open, setOpen] = useImmer(defaultOpen);

  return (
    <div className="category">
      <button type="button" className="head" onClick={() => setOpen(!open)}>
        <R_Icon iconId={props.iconId}></R_Icon>
        <h2>{props.name}</h2>
        <R_Icon upsideDown={open} iconId="chevron-down"></R_Icon>
      </button>
      <R_Accordion className="content" open={open}>
        {props.children}
      </R_Accordion>
    </div>
  );
}
