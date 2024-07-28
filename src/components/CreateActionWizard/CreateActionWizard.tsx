import { useImmer } from "use-immer";
import { R_FAB } from "../FAB/FAB";
import { R_StringOption } from "../StringOption/StringOption";
import { R_Wizard } from "../Wizard/Wizard";
import { ActionArg } from "../../modules/action";
import { AnimatePresence } from "framer-motion";
import { R_ArgumentCard } from "../ArgumentCard/ArgumentCard";
import { R_Button } from "../Button/Button";
import { useKey } from "../../modules/use_key";

interface CreateActionWizardProps {
  open: boolean;
  onCancel: () => void;
  onStartArgumentCreation: () => void;
  createArgumentWizardOpen: boolean;
}

export function R_CreateActionWizard(props: CreateActionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  // @ts-ignore
  const [name, setName] = useImmer("");
  const [nameValid, setNameValid] = useImmer(false);
  // @ts-ignore
  const [id, setId] = useImmer("");
  const [idValid, setIdValid] = useImmer(false);
  // @ts-ignore
  const [args, setArgs] = useImmer<ActionArg<any>[]>([]);

  useKey("Escape", () => {
    if (props.createArgumentWizardOpen) return;
    if (activePageIndex === 0) props.onCancel();
    else setActivePageIndex(0);
  });

  return (
    <R_Wizard
      activePageIndex={activePageIndex}
      open={props.open}
      pages={[
        <>
          <h2>Create custom action</h2>
          <R_StringOption
            onChange={(newValue, valid) => {
              setName(newValue);
              setNameValid(valid);
            }}
            required
            title="Action name"
            placeholder="Action name"
            iconId="rename"
            description="The name of the action shown in the web UI"
          />
          <R_StringOption
            onChange={(newValue, valid) => {
              setId(newValue);
              setIdValid(valid);
            }}
            required
            title="Action ID"
            placeholder="Action ID"
            iconId="identifier"
            description="The ID of the action that will be send to MacroDroid"
          />
        </>,
        <>
          <h2>Arguments</h2>
          <R_Button
            text="Add argument"
            onClick={() => props.onStartArgumentCreation()}
            title="Add argument"
            iconId="plus"
          />
          <div>
            <AnimatePresence>
              {args.map((arg) => (
                <R_ArgumentCard
                  name={arg.name}
                  type={arg.type}
                  id={arg.id}
                  key={`${arg.type}-${arg.id}`}
                />
              ))}
            </AnimatePresence>
          </div>
        </>,
      ]}
      leftButton={
        <>
          <R_FAB
            left
            hidden={activePageIndex === 1}
            title="Cancel action creation"
            onClick={props.onCancel}
            iconId="close"
          />
          <R_FAB
            left
            hidden={activePageIndex === 0}
            title="Previous page"
            onClick={() => setActivePageIndex(0)}
            iconId="chevron-left"
          />
        </>
      }
      rightButton={
        <>
          <R_FAB
            hidden={activePageIndex === 1 || !nameValid || !idValid}
            iconId="chevron-right"
            title="Next page"
            onClick={() => setActivePageIndex(1)}
          />
          <R_FAB
            hidden={activePageIndex === 0}
            iconId="check"
            title="Create custom action"
            onClick={() => {}}
          />
        </>
      }
    />
  );
}
