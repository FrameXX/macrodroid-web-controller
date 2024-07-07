import { ActionArgument, ActionArgumentType } from "../../modules/action";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { R_NumberOption } from "../NumberOption/NumberOption";
import { R_MultiLineStringOption } from "../MultiLineStringOption/MultiLineStringOption";
import { R_SelectOption } from "../SelectOption/SelectOption";
import { R_StringOption } from "../StringOption/StringOption";
import "./ActionArgumentInput.scss";
import { motion } from "framer-motion";
import {
  ANIMATE_SCALE_MOUNTED,
  ANIMATE_SCALE_UNMOUNTED,
} from "../../modules/const";

interface ActionArgumentInputProps {
  argument: ActionArgument<any>;
  onChange: (value: any) => void;
}

export function R_ActionArgumentInput(props: ActionArgumentInputProps) {
  function renderArgument() {
    switch (props.argument.type) {
      case ActionArgumentType.Boolean:
        return (
          <R_BooleanOption
            title={props.argument.name}
            onChange={props.onChange}
          />
        );
      case ActionArgumentType.String:
        return (
          <R_StringOption
            onChange={props.onChange}
            type="text"
            placeholder={props.argument.name}
            title={props.argument.name}
            description={props.argument.description}
          />
        );
      case ActionArgumentType.MultiLineString:
        return (
          <R_MultiLineStringOption
            onChange={props.onChange}
            placeholder={props.argument.name}
            title={props.argument.name}
            description={props.argument.description}
          />
        );
      case ActionArgumentType.Int:
        return (
          <R_NumberOption
            title={props.argument.name}
            onChange={props.onChange}
          />
        );
      case ActionArgumentType.Decimal:
        return (
          <R_NumberOption
            title={props.argument.name}
            onChange={props.onChange}
            step={0.01}
          />
        );
      case ActionArgumentType.Selection:
        return (
          <R_SelectOption
            onChange={props.onChange}
            options={props.argument.options as string[]}
            title={props.argument.name}
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
