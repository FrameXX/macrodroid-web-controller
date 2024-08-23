import { useImmer } from "use-immer";
import { R_Button } from "../Button/Button";
import { R_Icon } from "../Icon/Icon";
import { R_SplashBox } from "../SplashBox/SplashBox";
import "./NotificationPermissionSplashBox.scss";
import { BakeToast, Toast, ToastSeverity } from "../../modules/toaster";
import { R_WarningCard } from "../WarningCard/WarningCard";
import { R_SimpleCard } from "../SimpleCard/SimpleCard";

type PermissionStatus = "Granted" | "Denied" | "Not granted";

interface NotificationPermissionSplashBoxProps {
  bakeToast: BakeToast;
}

export function R_NotificationPermissionSplashBox(
  props: NotificationPermissionSplashBoxProps,
) {
  const [status, setStatus] = useImmer<PermissionStatus>(getStatus());
  const iconId = status === "Granted" ? "check" : "close";

  function getStatus(): PermissionStatus {
    switch (Notification.permission) {
      case "granted":
        return "Granted";
      case "denied":
        return "Denied";
      case "default":
        return "Not granted";
    }
  }

  async function request() {
    if (Notification.permission === "granted") {
      props.bakeToast(
        new Toast(
          "The Notification permission is already granted.",
          "transit-connection-variant",
        ),
      );
      return;
    }
    const granted = await Notification.requestPermission();
    setStatus(getStatus());
    if (granted === "granted") {
      props.bakeToast(
        new Toast(
          "Notification permission granted.",
          "check",
          ToastSeverity.Info,
        ),
      );
    } else {
      props.bakeToast(
        new Toast(
          "Notification permission denied.",
          "close",
          ToastSeverity.Info,
        ),
      );
    }
  }

  return (
    <R_SplashBox
      className="notification-permission-splash-box"
      splash={<R_Icon iconId="bell-ring" />}
    >
      <h2>Notification permission</h2>
      <R_SimpleCard className="status" iconId={iconId}>
        {status}
      </R_SimpleCard>
      The notification permission is used to notify you about action responses
      from connections and other incoming requests. It is not required.
      <br />
      <br />
      <R_WarningCard hidden={status !== "Denied"}>
        Once you deny the notification permission you have to grant it manually
        using in your web browser settings for this website. Some browser block
        notification permission requests by default.
      </R_WarningCard>
      <R_Button
        title="Grant permission"
        text="Grant permission"
        iconId="security"
        onClick={request}
      />
    </R_SplashBox>
  );
}
