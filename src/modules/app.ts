import { Toast, Toaster } from "./toaster";

export interface AppProps {
  setToasts: (newValue: Toast[]) => any;
}

export class App {
  public toaster: Toaster;

  constructor(props: AppProps) {
    this.toaster = new Toaster(props.setToasts);
  }
}
