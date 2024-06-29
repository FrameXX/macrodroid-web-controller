import { Updater } from "use-immer";
import { Random } from "./random";
import {
  TOASTER_MAX_TOASTS,
  TOAST_MS_PER_CHAR,
  TOAST_START_DELAY_MS,
} from "./const";

export enum ToastSeverity {
  Success = "success",
  Info = "info",
  Error = "error",
}

export class Toaster {
  private toastReadingTimeoutId = 0;
  private toasts: Toast[] = [];

  constructor(private readonly setToasts: Updater<Toast[]>) {}

  private updateToasts() {
    this.setToasts([...this.toasts]);
  }

  private clearToastReadingTimeout() {
    clearTimeout(this.toastReadingTimeoutId);
  }

  private setToastReadingTimeout() {
    const readToast = this.toasts[0];
    this.toastReadingTimeoutId = setTimeout(() => {
      this.removeMostBakedToast();
    }, readToast.readingDurationMs);
  }

  private removeMostBakedToast() {
    this.toasts.shift();
    this.updateToasts();
    if (this.isEmpty) return;
    this.setToastReadingTimeout();
  }

  private addToast(toast: Toast) {
    this.toasts.push(toast);
    this.updateToasts();
  }

  private get isEmpty() {
    return this.toasts.length === 0;
  }

  private get isFull() {
    return this.toasts.length >= TOASTER_MAX_TOASTS;
  }

  public removeToastById(toastId: number) {
    if (this.isEmpty) return;
    const readToast = this.toasts[0];
    if (readToast.id === toastId) {
      this.removeMostBakedToast();
      return;
    }
    this.toasts = this.toasts.filter((toast) => toast.id !== toastId);
    this.updateToasts();
  }

  public bake(toast: Toast) {
    if (this.isFull) {
      this.clearToastReadingTimeout();
      this.removeMostBakedToast();
    }
    const empty = this.isEmpty;
    this.addToast(toast);
    if (empty) this.setToastReadingTimeout();
  }
}

export class Toast {
  public readonly readingDurationMs: number;
  public readonly id: number = Random.id();

  constructor(
    public readonly message: string,
    public readonly iconId: string,
    public readonly severity: ToastSeverity = ToastSeverity.Info,
    readingDurationMs?: number,
  ) {
    if (!readingDurationMs) {
      this.readingDurationMs =
        TOAST_START_DELAY_MS + message.length * TOAST_MS_PER_CHAR;
      return;
    }
    if (readingDurationMs < 0)
      throw new RangeError(
        "The toast reading duration has to be a positive number.",
      );
    this.readingDurationMs = readingDurationMs;
  }
}
