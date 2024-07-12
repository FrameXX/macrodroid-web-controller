import { PropsWithChildren } from "react";
import "./SplashBox.scss";

interface SplashBoxProps extends PropsWithChildren {
  splash: React.ReactNode;
  className?: string;
}

export function R_SplashBox(props: SplashBoxProps) {
  return (
    <div className={`splash-box ${props.className}`}>
      <div className="splash">{props.splash}</div>
      <div>{props.children}</div>
    </div>
  );
}
