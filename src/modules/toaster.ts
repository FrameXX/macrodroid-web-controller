import { Random } from "./random";

type ToastSeverity = "success" | "info" | "error";

type SetToasts = (newValue: Toast[]) => any;

export class Toaster {
  private readonly maxToasts = 3;
  private toasts: Toast[] = [];
  private toastReadingTimeoutId = 0;

  constructor() {}

  private clearToastReadingTimeout() {
    clearTimeout(this.toastReadingTimeoutId);
  }

  private setToastReadingTimeout(setToasts: SetToasts) {
    const readToast = this.toasts[0];
    this.toastReadingTimeoutId = setTimeout(() => {
      // this.removeMostBakedToast(setToasts);
    }, readToast.readingDurationMs);
  }

  private removeMostBakedToast(setToasts: SetToasts) {
    this.toasts.shift();
    this.updateToastState(setToasts);
    if (this.isEmpty) return;
    this.setToastReadingTimeout(setToasts);
  }

  private updateToastState(setToasts: SetToasts) {
    setToasts([...this.toasts]);
  }

  private addToast(toast: Toast, setToasts: SetToasts) {
    this.toasts.push(toast);
    this.updateToastState(setToasts);
  }

  private get isEmpty() {
    return this.toasts.length === 0;
  }

  private get isFull() {
    return this.toasts.length >= this.maxToasts;
  }

  public removeToastById(toastId: number, setToasts: SetToasts) {
    if (this.isEmpty) return;
    const readToast = this.toasts[0];
    if (readToast.id === toastId) {
      this.removeMostBakedToast(setToasts);
      return;
    }
    this.toasts = this.toasts.filter((toast) => toast.id !== toastId);
    this.updateToastState(setToasts);
  }

  public bake(toast: Toast, setToasts: SetToasts) {
    if (this.isFull) {
      this.clearToastReadingTimeout();
      this.removeMostBakedToast(setToasts);
    }
    const empty = this.isEmpty;
    this.addToast(toast, setToasts);
    if (empty) this.setToastReadingTimeout(setToasts);
  }
}

export class Toast {
  private static readonly startDurationMs = 1200;
  private static readonly readingDurationPerCharMs = 80;
  public readonly readingDurationMs: number;
  public readonly id: number = Random.id();

  constructor(
    public readonly message: string,
    public readonly iconId: string,
    public readonly severity: ToastSeverity = "info",
    readingDurationMs?: number,
  ) {
    if (!readingDurationMs) {
      this.readingDurationMs =
        Toast.startDurationMs + message.length * Toast.readingDurationPerCharMs;
      return;
    }
    if (readingDurationMs < 0)
      throw new RangeError(
        "The toast reading duration has to be a positive number.",
      );
    this.readingDurationMs = readingDurationMs;
  }
}
