import { BakeToast } from "../../modules/toaster";
import { R_FAB } from "../FAB/FAB";
import { R_NotificationPermissionSplashBox } from "../NotificationPermissionSplashBox/NotificationPermissionSplashBox";
import { R_Wizard } from "../Wizard/Wizard";

interface NotificationPermissionWizardProps {
  open: boolean;
  bakeToast: BakeToast;
  onClose: () => void;
}

export function R_NotificationPermissionWizard(
  props: NotificationPermissionWizardProps,
) {
  return (
    <R_Wizard
      activePageIndex={0}
      open={props.open}
      pages={[
        <R_NotificationPermissionSplashBox bakeToast={props.bakeToast} />,
      ]}
      rightButton={
        <R_FAB
          title="Close notification permission configuration"
          onClick={props.onClose}
          iconId="close"
        />
      }
    />
  );
}
