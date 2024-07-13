import { useImmer } from "use-immer";
import { BakeToast } from "../../modules/toaster";
import { R_NotificationPermissionWizard } from "../NotificationPermissionWizard/NotificationPermissionWizard";
import { R_OpenableCategory } from "../OpenableCategory/OpenableCategory";
import "./Extras.scss";
import { R_ExternalLink } from "../ExternalLink/ExternalLink";

interface ExtrasProps {
  bakeToast: BakeToast;
}

export function R_Extras(props: ExtrasProps) {
  const [
    notificationPermissionWizardOpen,
    setNotificationPermissionWizardOpen,
  ] = useImmer(false);

  return (
    <>
      <R_OpenableCategory
        onCLick={() => {}}
        iconId="code-json"
        name="Magic text cheat sheet"
      />
      <R_OpenableCategory
        onCLick={() => setNotificationPermissionWizardOpen(true)}
        iconId="bell-ring"
        name="Notification permission"
      />
      <R_NotificationPermissionWizard
        open={notificationPermissionWizardOpen}
        onClose={() => setNotificationPermissionWizardOpen(false)}
        bakeToast={props.bakeToast}
      />
      <footer>
        Made with ❤️ by Jiří Král.
        <R_ExternalLink
          iconId="github"
          href="https://github.com/FrameXX/macrodroid-web-controller"
          title="Source code"
        >
          Source code
        </R_ExternalLink>
      </footer>
    </>
  );
}
