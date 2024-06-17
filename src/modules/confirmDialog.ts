import { Updater } from "use-immer";

export class ConfirmDialog {
  private _resolve?: (value: boolean) => void;

  constructor(
    private readonly setConfirmDialogOpen: Updater<boolean>,
    private readonly setConfirmDialogText: Updater<string>,
  ) {}

  public confirm(text: string): Promise<boolean> {
    this.setConfirmDialogText(text);
    this.setConfirmDialogOpen(true);
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
  }
}
