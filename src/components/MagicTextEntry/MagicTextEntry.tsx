import { motion } from "framer-motion";
import "./MagicTextEntry.scss";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";

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
    <motion.button
      layout
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
      onClick={copyToClipboard}
      title={props.title}
      className="magic-text-entry"
    >
      <div className="title">{props.title}</div>
      <pre>{props.magicText}</pre>
    </motion.button>
  );
}
