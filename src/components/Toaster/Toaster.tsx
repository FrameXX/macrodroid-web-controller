import { AnimatePresence } from "framer-motion";
import { Toast, Toaster } from "../../modules/toaster";
import R_Toast from "../Toast/Toast";
import "./Toaster.scss";

interface ToasterProps {
  toasts: Toast[];
  toaster: Toaster;
}

export default function R_Toaster(props: ToasterProps) {
  return (
    <div className="toaster">
      <AnimatePresence>
        {props.toasts.map((toast) => {
          return (
            <R_Toast
              key={toast.id}
              onClick={(id) => props.toaster.removeToastById(id)}
              toast={toast}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
