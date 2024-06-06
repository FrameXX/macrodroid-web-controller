import { Toast } from "./toaster";

export function notifyError(text: string, bakeToast: (toast: Toast) => any) {
  bakeToast(new Toast(text, "alert", "error"));
  console.error(text);
}
