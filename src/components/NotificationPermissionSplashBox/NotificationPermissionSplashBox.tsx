import { useImmer } from "use-immer";
import { R_Button } from "../Button/Button";
import { R_Icon } from "../Icon/Icon";
import { R_SplashBox } from "../SplashBox/SplashBox";
import { BakeToast } from "../../modules/toaster";
import { R_WarningCard } from "../WarningCard/WarningCard";
import { R_StatusCard } from "../StatusCard/StatusCard";

type PermissionStatus = "Granted" | "Denied" | "Not granted";

interface NotificationPermissionSplashBoxProps {
  bakeToast: BakeToast;
}

export function R_NotificationPermissionSplashBox(
  props: NotificationPermissionSplashBoxProps,
) {
  const [statusText, setStatusText] = useImmer<PermissionStatus>(getStatus());
  const StatusIconId = statusText === "Granted" ? "check" : "close";

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
      props.bakeToast({
        message: "The Notification permission is already granted.",
        iconId: "transit-connection-variant",
      });
      return;
    }
    const granted = await Notification.requestPermission();
    setStatusText(getStatus());
    if (granted === "granted") {
      props.bakeToast({
        message: "Notification permission granted.",
        iconId: "check",
      });
    } else {
      props.bakeToast({
        message: "Notification permission denied.",
        iconId: "close",
      });
    }
  }

  return (
    <R_SplashBox
      className="notification-permission-splash-box"
      splash={<R_Icon iconId="bell-ring" />}
    >
      <h2>Notification permission</h2>
      <R_StatusCard iconId={StatusIconId}>{statusText}</R_StatusCard>
      The notification permission is used to notify you about action responses
      from connections and other incoming requests. It is not required.
      <br />
      <br />
      <R_WarningCard hidden={statusText !== "Denied"}>
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
