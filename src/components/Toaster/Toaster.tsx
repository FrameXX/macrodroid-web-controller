import { AnimatePresence } from "framer-motion";
import { Toast } from "../../modules/toaster";
import R_Toast from "../Toast/Toast";
import "./Toaster.scss";

interface ToasterProps {
  toasts: Toast[];
  onToastClick: (id: number) => any;
}

/**
 * Renders a toaster component that displays a list of toast messages.
 *
 * @param {ToasterProps} props - The props for the toaster component.
 * @param {Toast[]} props.toasts - The list of toast messages to display.
 * @param {(id: number) => any} props.onToastClick - The function to call when a toast is clicked.
 * @return {JSX.Element} The rendered toaster component.
 */
export default function R_Toaster(props: ToasterProps) {
  return (
    <div className="toaster">
      <AnimatePresence>
        {props.toasts.map((toast) => {
          return (
            <R_Toast
              key={toast.id}
              onClick={(id) => props.onToastClick(id)}
              toast={toast}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
