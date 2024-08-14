import "./ExpandableCategory.scss";
import { R_Accordion } from "../Accordion/Accordion";
import { R_Icon } from "../Icon/Icon";
import { useImmer } from "use-immer";

interface CategoryProps extends React.PropsWithChildren {
  name: string;
  iconId: string;
  defaultOpen?: boolean;
}

export function R_ExpandableCategory(props: CategoryProps) {
  const defaultOpen = props.defaultOpen ? props.defaultOpen : false;
  const [open, setOpen] = useImmer(defaultOpen);

  const title = open
    ? `Collapse category ${props.name}`
    : `Expand category ${props.name}`;

  return (
    <div className="expandable-category">
      <R_Accordion className="content" open={open}>
        {props.children}
      </R_Accordion>
      <button onClick={() => setOpen(!open)} title={title} className="head">
        <R_Icon iconId={props.iconId} />
        <h2>{props.name}</h2>
        <R_Icon upsideDown={open} iconId="chevron-down" />
      </button>
    </div>
  );
}
