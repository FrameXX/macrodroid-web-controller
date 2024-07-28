import { useMemo, useRef } from "react";
import { MAGIC_TEXT_ENTRIES } from "../../modules/const";
import { useColumnDeterminator } from "../../modules/use_column_determinator";
import { R_FAB } from "../FAB/FAB";
import { R_MagicTextEntry } from "../MagicTextEntry/MagicTextEntry";
import { R_Wizard } from "../Wizard/Wizard";
import "./MagicTextCheatSheetWizard.scss";
import { AnimatePresence, motion } from "framer-motion";
import { R_SearchInput } from "../SearchInput/SearchInput";
import { useImmer } from "use-immer";
import { R_Icon } from "../Icon/Icon";
import { BakeToast, Toast } from "../../modules/toaster";
import { R_InfoCard } from "../InfoCard/InfoCard";
import { useKey } from "../../modules/use_key";

interface MagicTextCheatSheetWizardProps {
  open: boolean;
  onClose: () => void;
  bakeToast: BakeToast;
}

export function R_MagicTextCheatSheetWizard(
  props: MagicTextCheatSheetWizardProps,
) {
  const entriesContainer = useRef<HTMLDivElement>(null);
  const entriesColumns = useColumnDeterminator(
    entriesContainer,
    MAGIC_TEXT_ENTRIES,
    300,
  );
  const [filterValue, setFilterValue] = useImmer("");

  const filteredEntries = useMemo(() => {
    const filter = filterValue.toLowerCase();
    return MAGIC_TEXT_ENTRIES.filter((entry) =>
      `${entry.title}${entry.magicText}`.toLowerCase().includes(filter),
    );
  }, [filterValue]);

  useKey("Escape", props.onClose);

  return (
    <R_Wizard
      activePageIndex={0}
      open={props.open}
      pages={[
        <>
          <h2>Magic text cheat sheet</h2>
          <div className="sticky-filter">
            <R_Icon iconId="magnify" />
            <R_SearchInput
              placeholder="Filter magic text entries"
              onSearch={setFilterValue}
            />
          </div>
          <R_InfoCard id="copy-magic-text-notice">
            Click on a magic text entry to copy it to clipboard.
          </R_InfoCard>
          <motion.div
            animate={{ columns: entriesColumns }}
            ref={entriesContainer}
          >
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <R_MagicTextEntry
                  onCopy={() =>
                    props.bakeToast(
                      new Toast("Copied to clipboard.", "content-copy"),
                    )
                  }
                  title={entry.title}
                  magicText={entry.magicText}
                  key={entry.magicText}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </>,
      ]}
      rightButton={
        <R_FAB title="Close" onClick={props.onClose} iconId="close" />
      }
    />
  );
}
