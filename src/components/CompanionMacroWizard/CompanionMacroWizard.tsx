import { useKey } from "../../modules/use_key";
import { R_CompanionMacroSplashBox } from "../CompanionMacroSplashBox/CompanionMacroSplashBox";
import { R_FAB } from "../FAB/FAB";
import { R_Wizard } from "../Wizard/Wizard";

interface CompanionMacroWizardProps {
  open: boolean;
  onClose: () => void;
}

export function R_CompanionMacroWizard(props: CompanionMacroWizardProps) {
  useKey("Escape", props.onClose);

  return (
    <R_Wizard
      activePageIndex={0}
      open={props.open}
      pages={[<R_CompanionMacroSplashBox />]}
      rightButton={
        <R_FAB title="Close" onClick={props.onClose} iconId="close" />
      }
    />
  );
}
