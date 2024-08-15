import { useImmer } from "use-immer";
import { useDefaultProps } from "../../modules/use_default_props";
import { R_Button } from "../Button/Button";
import { R_Icon } from "../Icon/Icon";
import "./InfoCard.scss";
import { R_Accordion } from "../Accordion/Accordion";
import { useLocalStorage } from "../../modules/use_local_storage";
import { boolean } from "superstruct";
import { useEffect } from "react";

interface InfoCardProps extends React.PropsWithChildren {
  hidden?: boolean;
  id: string;
}

const defaultProps: Partial<InfoCardProps> = {
  hidden: false,
};

export function R_InfoCard(requiredProps: InfoCardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);
  const [closed, setClosed] = useImmer(false);
  useLocalStorage(closed, setClosed, {
    storageKey: getStorageKey(),
    stringify: (open) => open.toString(),
    parse: (string) => string === "true",
    struct: boolean(),
  });

  function getStorageKey() {
    return `infoCardClosed_${props.id}`;
  }

  function getClosedBefore() {
    if (!navigator.cookieEnabled) return false;
    return localStorage.getItem(getStorageKey()) === "true";
  }

  useEffect(() => {
    setClosed(getClosedBefore());
  }, [props.id]);

  return (
    <R_Accordion open={!props.hidden && !closed}>
      <div id={props.id} className="info-card">
        <R_Icon iconId="information" />
        <div className="content">{props.children}</div>
        <R_Button
          title="close"
          iconId="close"
          onClick={() => setClosed(true)}
        />
      </div>
    </R_Accordion>
  );
}
