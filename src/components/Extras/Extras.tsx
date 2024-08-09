import { useImmer } from "use-immer";
import { BakeToast } from "../../modules/toaster";
import { R_NotificationPermissionWizard } from "../NotificationPermissionWizard/NotificationPermissionWizard";
import { R_OpenableCategory } from "../OpenableCategory/OpenableCategory";
import "./Extras.scss";
import { R_ExternalLink } from "../ExternalLink/ExternalLink";
import { R_CompanionMacroWizard } from "../CompanionMacroWizard/CompanionMacroWizard";
import { R_MagicTextCheatSheetWizard } from "../MagicTextCheatSheetWizard/MagicTextCheatSheetWizard";

interface ExtrasProps {
  bakeToast: BakeToast;
  companionMacroWizardOpen: boolean;
  onCloseCompanionMacroWizard: () => void;
  onClickOpenCompanionMacroWizard: () => void;
}

export function R_Extras(props: ExtrasProps) {
  const [magicTextCheatSheetWizardOpen, setMagicTextCheatSheetWizardOpen] =
    useImmer(false);
  const [
    notificationPermissionWizardOpen,
    setNotificationPermissionWizardOpen,
  ] = useImmer(false);

  return (
    <>
      <R_OpenableCategory
        onClick={() => setMagicTextCheatSheetWizardOpen(true)}
        iconId="code-json"
        name="Magic text cheat sheet"
      />
      <R_OpenableCategory
        onClick={() => setNotificationPermissionWizardOpen(true)}
        iconId="bell-ring"
        name="Notification permission"
      />
      <R_OpenableCategory
        onClick={() => props.onClickOpenCompanionMacroWizard()}
        iconId="cogs"
        name="Companion macro"
      />
      <R_MagicTextCheatSheetWizard
        bakeToast={props.bakeToast}
        open={magicTextCheatSheetWizardOpen}
        onClose={() => setMagicTextCheatSheetWizardOpen(false)}
      />
      <R_NotificationPermissionWizard
        open={notificationPermissionWizardOpen}
        onClose={() => setNotificationPermissionWizardOpen(false)}
        bakeToast={props.bakeToast}
      />
      <R_CompanionMacroWizard
        open={props.companionMacroWizardOpen}
        onClose={() => props.onCloseCompanionMacroWizard()}
      />
      <footer>
        <R_ExternalLink
          iconId="github"
          href="https://github.com/FrameXX/macrodroid-web-controller"
          title="Source code"
        >
          Source code
        </R_ExternalLink>
        Made with ❤️ by Jiří Král.
      </footer>
    </>
  );
}
