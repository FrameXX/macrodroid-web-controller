import { ActionArg, ActionArgType } from "../../modules/action";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { R_NumberOption } from "../NumberOption/NumberOption";
import { R_MultiLineStringOption } from "../MultiLineStringOption/MultiLineStringOption";
import { R_SelectOption } from "../SelectOption/SelectOption";
import { R_StringOption } from "../StringOption/StringOption";
import "./ActionArgInput.scss";
import { motion } from "framer-motion";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";

interface ActionArgumentInputProps {
  argument: ActionArg<any>;
  onChange: (value: any) => void;
  value?: any;
}

export function R_ActionArgInput(props: ActionArgumentInputProps) {
  function renderArgument() {
    switch (props.argument.type) {
      case ActionArgType.Boolean:
        return (
          <R_BooleanOption
            title={props.argument.name}
            onChange={props.onChange}
            value={props.value}
            description={props.argument.description}
          />
        );
      case ActionArgType.String:
        return (
          <R_StringOption
            onChange={props.onChange}
            type="text"
            placeholder={props.argument.name}
            title={props.argument.name}
            description={props.argument.description}
            value={props.value}
          />
        );
      case ActionArgType.MultiLineString:
        return (
          <R_MultiLineStringOption
            onChange={props.onChange}
            placeholder={props.argument.name}
            title={props.argument.name}
            description={props.argument.description}
            value={props.value}
          />
        );
      case ActionArgType.Integer:
        return (
          <R_NumberOption
            value={props.value}
            title={props.argument.name}
            onChange={props.onChange}
            description={props.argument.description}
          />
        );
      case ActionArgType.Decimal:
        return (
          <R_NumberOption
            value={props.value}
            title={props.argument.name}
            onChange={props.onChange}
            decimal
            description={props.argument.description}
          />
        );
      case ActionArgType.Selection:
        return (
          <R_SelectOption
            value={props.value}
            onChange={props.onChange}
            options={props.argument.options as string[]}
            title={props.argument.name}
            description={props.argument.description}
          />
        );
      default:
        return <>Invalid argument type</>;
    }
  }

  return (
    <motion.div
      className="action-argument-input"
      layout
      initial={ANIMATE_SCALE_UNMOUNTED}
      animate={ANIMATE_SCALE_MOUNTED}
      exit={ANIMATE_SCALE_UNMOUNTED}
    >
      {renderArgument()}
    </motion.div>
  );
}
