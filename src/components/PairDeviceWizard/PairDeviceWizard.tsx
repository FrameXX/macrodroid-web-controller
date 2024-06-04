import { TargetAndTransition, motion } from "framer-motion";
import R_FAB from "../FAB/FAB";
import R_WizardNavigator from "../WizardNavigator/WizardNavigator";
import "./PairDeviceWizard.scss";
import R_TitleWithIcon from "../TitleWithIcon/TitleWithIcon";

interface AddDeviceWizardProps {
  open: boolean;
  onClose: () => any;
}

export default function R_PairDeviceWizard(props: AddDeviceWizardProps) {
  function nextCard() {}

  const animate: TargetAndTransition = {
    translateY: props.open ? "none" : "-100%",
  };

  return (
    <motion.div animate={animate} id="add-device-wizard">
      <div>
        <div>
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
              installed on your target device
            </h3>
          </R_TitleWithIcon>
          <R_TitleWithIcon iconId="import">
            <h3>You have the companion macro imported into MacroDroid</h3>
          </R_TitleWithIcon>
          <R_WizardNavigator
            leftButton={
              <R_FAB
                left
                title="Cancel pairing of new device"
                onClick={props.onClose}
                iconId="close"
              />
            }
            rightButton={
              <R_FAB
                title="Continue"
                iconId="chevron-right"
                onClick={nextCard}
              />
            }
          />
        </div>
        <div className="navigator-placeholder" />
      </div>
    </motion.div>
  );
}
