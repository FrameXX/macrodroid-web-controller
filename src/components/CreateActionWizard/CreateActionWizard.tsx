import { useImmer } from "use-immer";
import { R_FAB } from "../FAB/FAB";
import { R_StringOption } from "../StringOption/StringOption";
import { R_Wizard } from "../Wizard/Wizard";
import { Action, ActionArg } from "../../modules/action";
import { AnimatePresence } from "framer-motion";
import { R_ArgumentCard } from "../ArgumentCard/ArgumentCard";
import { R_Button } from "../Button/Button";
import { useKey } from "../../modules/use_key";
import { useRef } from "react";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { Confirm } from "../../modules/confirm_dialog";

interface CreateActionWizardProps {
  confirm: Confirm;
  open: boolean;
  args: ActionArg<any>[];
  actions: Action[];
  onArgDelete: (index: number) => void;
  onArgMoveDown: (index: number) => void;
  onArgMoveUp: (index: number) => void;
  onCreate: (action: Action) => void;
  onCancel: () => void;
  onStartArgumentCreation: () => void;
  createArgumentWizardOpen: boolean;
}

export function R_CreateActionWizard(props: CreateActionWizardProps) {
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [name, setName] = useImmer("");
  const [nameValid, setNameValid] = useImmer(false);
  const [id, setId] = useImmer("");
  const [idValid, setIdValid] = useImmer(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const idInput = useRef<HTMLInputElement>(null);

  useKey("Escape", () => {
    if (props.createArgumentWizardOpen) return;
    if (activePageIndex === 0) props.onCancel();
    else setActivePageIndex(0);
  });

  useKey("Enter", () => {
    if (activePageIndex === 1) create();
  });

  function canGoSecondPage() {
    return nameValid && idValid;
  }

  function create() {
    const action: Action = {
      id,
      name,
      iconId: "play",
      args: props.args,
      keywords: [],
    };
    props.onCreate(action);
    reset();
  }

  function reset() {
    setActivePageIndex(0);
    setName("");
    setNameValid(false);
    setId("");
    setIdValid(false);
  }

  async function handleNextPage() {
    const sameIDActionIndex = props.actions.findIndex((action) => {
      return action.id === id;
    });
    if (sameIDActionIndex !== -1) {
      const confirm = await props.confirm(
        "Action with the same ID already exists. This will cause conflicts. Are you sure you want to proceed?",
      );
      if (!confirm) return;
    }
    setActivePageIndex(1);
  }

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
            value={name}
            required
            title="Action name"
            placeholder="Action name"
            iconId="rename"
            description="The name of the action shown in the web UI"
            ref={nameInput}
            onKeyUp={(event) => {
              if (event.key === "Enter") idInput.current?.focus();
            }}
          />
          <R_StringOption
            onChange={(newValue, valid) => {
              setId(newValue);
              setIdValid(valid);
            }}
            autoCapitalize="none"
            value={id}
            required
            title="Action ID"
            placeholder="Action ID"
            iconId="identifier"
            description="The ID of the action that will be send to MacroDroid"
            ref={idInput}
            onKeyUp={(event) => {
              if (event.key === "Enter" && canGoSecondPage()) handleNextPage();
            }}
          />
        </>,
        <>
          <h2>Arguments</h2>
          <R_IconNotice hidden={props.args.length > 0}>
            No arguments configured
            <br />
            <small>Action does not have to have arguments.</small>
          </R_IconNotice>
          <div>
            <AnimatePresence>
              {props.args.map((arg, index) => (
                <R_ArgumentCard
                  key={arg.id}
                  name={arg.name}
                  type={arg.type}
                  id={arg.id}
                  onDelete={() => props.onArgDelete(index)}
                  onMoveDown={() => props.onArgMoveDown(index)}
                  onMoveUp={() => props.onArgMoveUp(index)}
                />
              ))}
            </AnimatePresence>
          </div>
          <R_Button
            text="Add argument"
            onClick={() => props.onStartArgumentCreation()}
            title="Add argument"
            iconId="plus"
          />
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
            hidden={activePageIndex === 1 || !canGoSecondPage()}
            iconId="chevron-right"
            title="Next page"
            onClick={handleNextPage}
          />
          <R_FAB
            hidden={activePageIndex === 0}
            iconId="check"
            title="Create custom action"
            onClick={create}
          />
        </>
      }
    />
  );
}
