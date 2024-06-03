import { Toast, Toaster } from "./toaster";

export interface AppProps {
  setToasts: (newValue: Toast[]) => any;
}

export class App {
  public toaster: Toaster;

  constructor(props: AppProps) {
    this.toaster = new Toaster(props.setToasts);
    this.toaster.bake(new Toast("Testing message", "cancel"));
    setTimeout(() => {
      this.toaster.bake(new Toast("Testing message 2", "cancel"));
      setTimeout(() => {
        this.toaster.bake(new Toast("Testing message 3", "cancel"));
      }, 500);
      setTimeout(() => {
        this.toaster.bake(new Toast("Testing message 4", "cancel"));
      }, 700);
    }, 1000);
  }
}
