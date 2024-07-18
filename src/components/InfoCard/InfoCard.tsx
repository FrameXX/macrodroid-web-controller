import { useImmer } from "use-immer";
import { useDefaultProps } from "../../modules/use_default_props";
import { R_Button } from "../Button/Button";
import { R_Icon } from "../Icon/Icon";
import "./InfoCard.scss";
import { R_Accordion } from "../Accordion/Accordion";
import { useLocalStorage } from "../../modules/use_local_storage";
import { boolean } from "superstruct";

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
    storageKey: `infoCardClosed_${props.id}`,
    stringify: (open) => `${open}`,
    parse: (string) => string === "true",
    struct: boolean(),
  });

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
