import { TargetAndTransition, motion } from "framer-motion";
import R_FAB from "../FAB/FAB";
import R_WizardNavigator from "../WizardNavigator/WizardNavigator";
import "./PairDeviceWizard.scss";
import R_TitleWithIcon from "../TitleWithIcon/TitleWithIcon";
import { useState } from "react";
import R_DescribedInput from "../DescribedInput/DescribedInput";
import screenshot1Src from "../../assets/img/screenshot_1.webp";

interface AddDeviceWizardProps {
  open: boolean;
  onClose: () => any;
}

export default function R_PairDeviceWizard(props: AddDeviceWizardProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [deviceNameValid, setDeviceNameValid] = useState(false);
  const [webhookIdValid, setWebhookIdValid] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [webhookId, setWebhookId] = useState("");

  function nextCard() {
    setActiveCardIndex(activeCardIndex + 1);
  }

  function previousCard() {
    setActiveCardIndex(activeCardIndex - 1);
  }

  function animateCard(index: number): TargetAndTransition {
    if (index < activeCardIndex) {
      return {
        display: "none",
        translateX: "-100%",
        opacity: 0,
      };
    } else if (index > activeCardIndex) {
      return {
        display: "none",
        translateX: "100%",
        opacity: 0,
      };
    } else {
      return {
        display: "block",
      };
    }
  }

  const animate: TargetAndTransition = {
    translateY: props.open ? "none" : "-100%",
    display: props.open ? "block" : "none",
  };

  return (
    <motion.div animate={animate} id="add-device-wizard">
      <motion.div className="card" animate={animateCard(0)}>
        <div>
          <h2>Meet the prerequisites</h2>
        </div>
        <R_TitleWithIcon iconId="wifi-check">
          <h3>Your target device is connected to internet</h3>
        </R_TitleWithIcon>
        <R_TitleWithIcon iconId="package-down">
          <h3>
            You have{" "}
            <a
              href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid"
              target="_blank"
            >
              MacroDroid
            </a>{" "}
            installed and running on your target device
          </h3>
        </R_TitleWithIcon>
        <R_TitleWithIcon iconId="import">
          <h3>You have the companion macro imported into MacroDroid</h3>
        </R_TitleWithIcon>
        <div className="navigator-placeholder" />
      </motion.div>
      <motion.div className="card" animate={animateCard(1)}>
        <h2>Enter info</h2>
        <form id="pair-info">
          <R_DescribedInput
            onChange={(event) => {
              setDeviceName(event.target.value);
              setDeviceNameValid(event.target.validity.valid);
            }}
            required
            type="text"
            maxLength={40}
            placeholder="Enter device name"
            description="This is your custom name, so that you can differentiate the device from other paired devices"
          />
          <R_DescribedInput
            onChange={(event) => {
              setWebhookId(event.target.value);
              setWebhookIdValid(event.target.validity.valid);
            }}
            required
            pattern="(?:[a-z]|\d|-){16,32}"
            type="text"
            autoCapitalize="none"
            placeholder="Enter webhook ID"
            description={
              <>
                <div>
                  You can find webhook URL of your device by going to New macro
                  &gt; Add trigger &gt; Connectivity &gt; Webhook (Url). Enter
                  just the ID (between last 2 forward slashes).
                </div>
                <img src={screenshot1Src} />
              </>
            }
          />
        </form>
        <div className="navigator-placeholder" />
      </motion.div>
      <motion.div className="card" animate={animateCard(2)}></motion.div>
      <R_WizardNavigator
        dotCount={3}
        activeDotIndex={activeCardIndex}
        leftButton={
          <>
            <R_FAB
              hidden={activeCardIndex !== 0}
              left
              title="Cancel pairing of new device"
              onClick={props.onClose}
              iconId="close"
            />
            <R_FAB
              hidden={activeCardIndex === 0}
              left
              title="Previous card"
              onClick={previousCard}
              iconId="chevron-left"
            />
          </>
        }
        rightButton={
          <R_FAB
            hidden={
              activeCardIndex === 1 && (!deviceNameValid || !webhookIdValid)
            }
            title="Next card"
            iconId="chevron-right"
            onClick={nextCard}
          />
        }
      />
    </motion.div>
  );
}
