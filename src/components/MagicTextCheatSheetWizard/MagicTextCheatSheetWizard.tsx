import { useMemo, useRef } from "react";
import { MAGIC_TEXT_ENTRIES } from "../../modules/const";
import { R_FAB } from "../FAB/FAB";
import { R_MagicTextEntry } from "../MagicTextEntry/MagicTextEntry";
import { R_Wizard } from "../Wizard/Wizard";
import "./MagicTextCheatSheetWizard.scss";
import { AnimatePresence } from "framer-motion";
import { R_SearchInput } from "../SearchInput/SearchInput";
import { useImmer } from "use-immer";
import { R_Icon } from "../Icon/Icon";
import { BakeToast } from "../../modules/toaster";
import { R_InfoCard } from "../InfoCard/InfoCard";
import { useKey } from "../../modules/use_key";
import { R_MultiColList } from "../MultiColList/MultiColList";
import { R_IconNotice } from "../IconNotice/IconNotice";

interface MagicTextCheatSheetWizardProps {
  open: boolean;
  onClose: () => unknown;
  bakeToast: BakeToast;
}

export function R_MagicTextCheatSheetWizard(
  props: MagicTextCheatSheetWizardProps,
) {
  const [filterValue, setFilterValue] = useImmer("");
  const filteredEntries = useMemo(() => {
    const filter = filterValue.toLowerCase();
    return MAGIC_TEXT_ENTRIES.filter((entry) =>
      `${entry.title}${entry.magicText}`.toLowerCase().includes(filter),
    );
  }, [filterValue]);
  const filterValueInput = useRef<HTMLInputElement>(null);

  useKey("Escape", props.onClose);

  useKey("/", () => {
    if (props.open) filterValueInput.current?.focus();
  });

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
              placeholder='Filter magic text entries (type "/" to focus)'
              onSearch={setFilterValue}
              ref={filterValueInput}
            />
          </div>
          <R_InfoCard id="copy-magic-text-notice">
            Click on a magic text entry to copy it to clipboard.
          </R_InfoCard>
          <R_InfoCard id="magic-text-entries-notice">
            Entries that are present only on some devices or are relevant to the
            currently running macro like macro category etc. are not shown here.
          </R_InfoCard>
          <R_IconNotice
            iconId="filter-remove"
            hidden={filteredEntries.length !== 0}
          >
            All entries have been filtered out.
          </R_IconNotice>
          <R_MultiColList items={MAGIC_TEXT_ENTRIES} minColWidthPx={300}>
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <R_MagicTextEntry
                  onCopy={() =>
                    props.bakeToast({
                      message: "Copied to clipboard.",
                      iconId: "content-copy",
                    })
                  }
                  title={entry.title}
                  magicText={entry.magicText}
                  key={entry.magicText}
                />
              ))}
            </AnimatePresence>
          </R_MultiColList>
        </>,
      ]}
      rightButton={
        <R_FAB title="Close" onClick={props.onClose} iconId="close" />
      }
    />
  );
}
