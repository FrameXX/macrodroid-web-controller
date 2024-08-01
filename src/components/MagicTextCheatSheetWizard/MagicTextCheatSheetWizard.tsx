import { useMemo } from "react";
import { MAGIC_TEXT_ENTRIES } from "../../modules/const";
import { R_FAB } from "../FAB/FAB";
import { R_MagicTextEntry } from "../MagicTextEntry/MagicTextEntry";
import { R_Wizard } from "../Wizard/Wizard";
import "./MagicTextCheatSheetWizard.scss";
import { AnimatePresence } from "framer-motion";
import { R_SearchInput } from "../SearchInput/SearchInput";
import { useImmer } from "use-immer";
import { R_Icon } from "../Icon/Icon";
import { BakeToast, Toast } from "../../modules/toaster";
import { R_InfoCard } from "../InfoCard/InfoCard";
import { useKey } from "../../modules/use_key";
import { R_MultiColList } from "../MultiColList/MultiColList";

interface MagicTextCheatSheetWizardProps {
  open: boolean;
  onClose: () => void;
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
          <R_InfoCard id="copy-magic-text-info">
            Click on a magic text entry to copy it to clipboard.
          </R_InfoCard>
          <R_MultiColList items={MAGIC_TEXT_ENTRIES} minColWidthPx={300}>
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
          </R_MultiColList>
        </>,
      ]}
      rightButton={
        <R_FAB title="Close" onClick={props.onClose} iconId="close" />
      }
    />
  );
}
