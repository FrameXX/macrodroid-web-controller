import "./MagicTextEntry.scss";

export interface MagicTextEntryProps {
  title: string;
  magicText: string;
  onCopy?: () => void;
}

export function R_MagicTextEntry(props: MagicTextEntryProps) {
  function copyToClipboard() {
    navigator.clipboard.writeText(`{${props.magicText}}`);
    if (props.onCopy) props.onCopy();
  }

  return (
    <button
      onClick={copyToClipboard}
      title={props.title}
      className="magic-text-entry"
    >
      <div className="title">{props.title}</div>
      <pre>{props.magicText}</pre>
    </button>
  );
}
