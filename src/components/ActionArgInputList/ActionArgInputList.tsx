import { AnimatePresence, motion } from "framer-motion";
import { R_ActionArgInput } from "../ActionArgInput/ActionArgInput";
import { Action, ActionArg } from "../../modules/action";
import { useEffect, useRef } from "react";
import { useColumnDeterminator } from "../../modules/use_column_determinator";
import { useImmer } from "use-immer";
import { useForceUpdate } from "../../modules/use_force_update";

interface ActionArgInputListProps {
  configuredAction: Action | null;
  onArgChange: (index: number, newValue: any) => void;
}

export function R_ActionArgInputList(props: ActionArgInputListProps) {
  const [configuredArgs, setConfiguredArgs] = useImmer<ActionArg<any>[]>([]);
  const actionArgsContainer = useRef(null);
  const actionArgsColumns = useColumnDeterminator(
    actionArgsContainer,
    configuredArgs,
    400,
  );
  const forceUpdate = useForceUpdate();

  function shouldArgBeRendered(arg: ActionArg<any>): boolean {
    if (!arg.useCondition) return true;
    return (
      configuredArgs[arg.useCondition.argumentIndex].value ===
      arg.useCondition.argumentValue
    );
  }

  useEffect(() => {
    setConfiguredArgs(props.configuredAction?.args || []);
    forceUpdate();
  }, [props.configuredAction]);

  return (
    <motion.div
      animate={{ columns: actionArgsColumns }}
      ref={actionArgsContainer}
    >
      {props.configuredAction && (
        <AnimatePresence>
          {configuredArgs.map(
            (arg, index) =>
              shouldArgBeRendered(arg) && (
                <R_ActionArgInput
                  value={configuredArgs[index].value}
                  onChange={(newValue) => {
                    props.onArgChange(index, newValue);
                    setConfiguredArgs((configuredArgs) => {
                      configuredArgs[index].value = newValue;
                      return configuredArgs;
                    });
                    forceUpdate();
                  }}
                  key={`${props.configuredAction?.id}-${index}`}
                  argument={arg}
                />
              ),
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
