import { Target, motion } from "framer-motion";
import { R_Icon } from "../Icon/Icon";
import "./ConfirmDialog.scss";
import { R_Button } from "../Button/Button";
import {
  DEFAULT_TRANSITION_DURATION_S,
  DEFAULT_TRANSITION_OFFSET,
} from "../../modules/const";
import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function R_ConfirmDialog(props: ConfirmDialogProps) {
  const animateDialog: Target = props.open
    ? { opacity: 1, y: 0 }
    : { display: "none", opacity: 0, y: -DEFAULT_TRANSITION_OFFSET };
  const animateBackdrop: Target = props.open
    ? { opacity: 0.7 }
    : { display: "none", opacity: 0 };
  const confirmButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (props.open)
      setTimeout(
        () => confirmButton.current?.focus(),
        DEFAULT_TRANSITION_DURATION_S * 1000,
      );
  }, [props.open]);

  return (
    <>
      <motion.div animate={animateBackdrop} id="confirm-dialog-backdrop" />
      <motion.dialog animate={animateDialog} id="confirm-dialog">
        <div className="content">
          <div className="title">
            <R_Icon iconId="check-all" />
            <h2>Confirm</h2>
          </div>
          {props.text}
        </div>
        <div className="actions">
          <R_Button
            onClick={props.onCancel}
            title="Cancel"
            iconId="cancel"
            text="Cancel"
          />
          <R_Button
            ref={confirmButton}
            onClick={props.onConfirm}
            title="Confirm"
            iconId="check"
            text="Confirm"
          />
        </div>
      </motion.dialog>
    </>
  );
}
