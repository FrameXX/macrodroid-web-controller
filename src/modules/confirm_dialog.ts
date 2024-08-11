import { Updater } from "use-immer";

export type Confirm = (text: string) => Promise<boolean>;

export class ConfirmDialog {
  public open = false;
  private _resolve?: (value: boolean) => void;

  constructor(
    private readonly setConfirmDialogOpen: Updater<boolean>,
    private readonly setConfirmDialogText: Updater<string>,
  ) {
    addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.key === "Escape" && this.resolve) this.resolve(false);
    });
  }

  public confirm(text: string): Promise<boolean> {
    this.setConfirmDialogText(text);
    this.setConfirmDialogOpen(true);
    this.open = true;
    return new Promise((resolve) => (this._resolve = resolve));
  }

  public resolve(value: boolean) {
    if (!this._resolve) {
      console.error("Resolver not found.");
      return;
    }
    this._resolve(value);
    this.setConfirmDialogOpen(false);
    this._resolve = undefined;
    this.open = false;
  }
}
