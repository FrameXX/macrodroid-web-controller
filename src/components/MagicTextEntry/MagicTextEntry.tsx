import { R_GenericCard } from "../GenericCard/GenericCard";
import "./MagicTextEntry.scss";

export interface MagicTextEntryProps {
  title: string;
  magicText: string;
}

export function R_MagicTextEntry(props: MagicTextEntryProps) {
  return (
    <R_GenericCard title={props.title} className="magic-text-entry" button>
      <div className="title">{props.title}</div>
      <pre>{props.magicText}</pre>
    </R_GenericCard>
  );
}
