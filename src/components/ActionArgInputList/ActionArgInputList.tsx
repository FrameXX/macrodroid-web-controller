import { AnimatePresence } from "framer-motion";
import { R_ActionArgInput } from "../ActionArgInput/ActionArgInput";
import { Action, ActionArg } from "../../modules/action";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useForceUpdate } from "../../modules/use_force_update";
import { R_MultiColList } from "../MultiColList/MultiColList";

interface ActionArgInputListProps {
  configuredAction: Action | null;
  onArgChange: (index: number, newValue: unknown) => unknown;
}

export function R_ActionArgInputList(props: ActionArgInputListProps) {
  const [configuredArgs, setConfiguredArgs] = useImmer<ActionArg<unknown>[]>(
    [],
  );
  const forceUpdate = useForceUpdate();

  function shouldArgBeRendered(arg: ActionArg<unknown>): boolean {
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
    <R_MultiColList items={configuredArgs} minColWidthPx={400}>
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
    </R_MultiColList>
  );
}
