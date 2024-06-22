import { useImmer } from "use-immer";
import R_Category from "../Category/Category";
import R_FAB from "../FAB/FAB";
import R_IconNotice from "../IconNotice/IconNotice";
import R_ConfigActionWizard from "../ConfigActionWizard/ConfigActionWizard";

export default function R_Actions() {
  const [configActionWizardOpen, setConfigActionWizardOpen] = useImmer(false);

  return (
    <>
      <R_Category defaultOpen name="Saved" iconId="star">
        <R_IconNotice>No actions saved</R_IconNotice>
      </R_Category>
      <R_Category defaultOpen name="Recent" iconId="history">
        <R_IconNotice>No actions run</R_IconNotice>
      </R_Category>
      <R_FAB
        onClick={() => setConfigActionWizardOpen(true)}
        title="Configure new action"
        iconId="cog-play"
      />
      <R_ConfigActionWizard
        open={configActionWizardOpen}
        onClose={() => setConfigActionWizardOpen(false)}
      />
    </>
  );
}
