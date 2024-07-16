import { useImmer } from "use-immer";
import { R_Wizard } from "../Wizard/Wizard";
import { R_FAB } from "../FAB/FAB";
import { R_SplashBox } from "../SplashBox/SplashBox";
import { R_Icon } from "../Icon/Icon";
import "./WelcomeWizard.scss";
import { NTFY_TOPIC_PREFIX } from "../../modules/const";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { R_NotificationPermissionSplashBox } from "../NotificationPermissionSplashBox/NotificationPermissionSplashBox";
import { BakeToast } from "../../modules/toaster";
import { useLocalStorage } from "../../modules/use_local_storage";
import { boolean } from "superstruct";
import { R_CompanionMacroSplashBox } from "../CompanionMacroSplashBox/CompanionMacroSplashBox";

interface WelcomeWizardProps {
  bakeToast: BakeToast;
}

export function R_WelcomeWizard(props: WelcomeWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [acceptTOS, setAcceptTOS] = useImmer(false);
  const [open, setOpen] = useImmer(true);

  useLocalStorage(open, setOpen, {
    storageKey: "welcomeWizard",
    stringify: (open) => `${open}`,
    parse: (string) => string === "true",
    struct: boolean(),
  });

  Notification.permission;

  function nextPage() {
    if (activePageIndex === 6) {
      setOpen(false);
      return;
    }
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex + 1);
  }

  function previousPage() {
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex - 1);
  }

  return (
    <R_Wizard
      fullscreen
      open={open}
      pages={[
        <R_SplashBox splash={<R_Icon iconId="web" />}>
          <h2>Welcome to MacroDroid Web Controller</h2>
          An easy way to remotely control MacroDroid using web interface.
        </R_SplashBox>,
        <R_SplashBox splash={<R_Icon iconId="transit-connection-variant" />}>
          <h2>Make connections</h2>
          Connect with devices and see when they were active the last time.
        </R_SplashBox>,
        <R_SplashBox splash={<R_Icon iconId="play" />}>
          <h2>Trigger actions</h2>
          Trigger a variety of predefined actions on single or multiple
          connections, create custom actions and save your favourite ones.
        </R_SplashBox>,
        <R_SplashBox splash={<R_Icon iconId="text-box" />}>
          <h2>Inspect log</h2>
          See responses to your actions and history of requests.
        </R_SplashBox>,
        <R_SplashBox splash={<R_Icon iconId="security" />}>
          <h2>Disclaimer of liability</h2>
          The outging requests from this website are routed through MacroDroid
          webhooks servers and are thus fairly private, however the incoming
          requests to this website are routed through ntfy.sh servers over topic
          that follows the following format:{" "}
          <pre>{NTFY_TOPIC_PREFIX}-&#123;connection id&#125;</pre>For example
          "macrodroid-wc-muqaruha" could be such a topic.
          <br />
          <br />I cannot gurantee that someone else won't be able to read the
          contents of these requests <b>(while it is improbable)</b> and I urge
          you to{" "}
          <b>
            refrain from sending any sensitive or personal data using this
            website
          </b>
          . I am not responsible for any data loss.
          <br />
          <br />
          <R_BooleanOption
            value={acceptTOS}
            onChange={setAcceptTOS}
            iconId="emoticon-cool"
            title="I understand and agree"
          />
        </R_SplashBox>,
        <R_NotificationPermissionSplashBox bakeToast={props.bakeToast} />,
        <R_CompanionMacroSplashBox />,
      ]}
      leftButton={
        <>
          <R_FAB
            hidden={activePageIndex === 0}
            left
            title="Previous page"
            onClick={previousPage}
            iconId="chevron-left"
          />
        </>
      }
      rightButton={
        <>
          <R_FAB
            hidden={activePageIndex === 4 && !acceptTOS}
            title="Next page"
            iconId="chevron-right"
            onClick={nextPage}
          />
        </>
      }
      activePageIndex={activePageIndex}
      hideNavigatorPlaceholder={activePageIndex !== 4 && activePageIndex !== 5}
    />
  );
}
