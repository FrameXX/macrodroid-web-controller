import { useImmer } from "use-immer";
import { R_FAB } from "../FAB/FAB";
import { R_StringOption } from "../StringOption/StringOption";
import { R_Wizard } from "../Wizard/Wizard";
import { R_SelectOption } from "../SelectOption/SelectOption";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { R_NumberOption } from "../NumberOption/NumberOption";
import { ActionArg, ActionArgType } from "../../modules/action";
import { R_MultiLineStringOption } from "../MultiLineStringOption/MultiLineStringOption";
import { R_Button } from "../Button/Button";

interface AddArgumentWizardProps {
  open: boolean;
  onCancel: () => void;
  onAdd: (arg: ActionArg<any>) => void;
}

export function R_CreateArgumentWizard(props: AddArgumentWizardProps) {
  const [name, setName] = useImmer("");
  const [id, setId] = useImmer("");
  const [type, setType] = useImmer<ActionArgType>(0);
  const [value, setValue] = useImmer<any>(null);

  // @ts-ignore
  function reset() {
    setName("");
    setId("");
    setType(0);
    setValue(null);
  }

  return (
    <R_Wizard
      activePageIndex={0}
      open={props.open}
      pages={[
        <>
          <h2>Add argument</h2>
          <R_StringOption
            onChange={setName}
            required
            title="Name"
            iconId="rename"
            description="The name of the argument shown in the web UI"
          />
          <R_StringOption
            onChange={setName}
            title="Description"
            iconId="rename"
            description="Describe what is the argument for. This is not required."
          />
          <R_StringOption
            onChange={setId}
            required
            title="ID"
            iconId="identifier"
            description="The ID of the argument that will be send to MacroDroid"
          />
          <R_SelectOption
            onChange={setType}
            title="Type"
            options={[
              "Boolean",
              "Integer",
              "Selection",
              "String",
              "Multiline string",
              "Decimal",
            ]}
          />
          <R_BooleanOption
            onChange={setValue}
            hidden={type !== 0}
            title="Default value"
          />
          <R_NumberOption
            onChange={setValue}
            hidden={type !== 1 && type !== 5}
            title="Default value"
          />
          <R_StringOption
            onChange={setValue}
            hidden={type !== 3}
            title="Default value"
          />
          <R_MultiLineStringOption
            onChange={setValue}
            hidden={type !== 4}
            title="Default value"
          />
          <div>
            <h3>Select options</h3>
            <R_Button
              iconId="plus"
              title="Add option"
              text="Add option"
              onClick={() => {}}
            />
            <div></div>
          </div>
        </>,
      ]}
      leftButton={
        <R_FAB
          title="Cancel argument creation"
          onClick={props.onCancel}
          iconId="close"
          left
        />
      }
      rightButton={
        <R_FAB
          title="Add argument"
          onClick={() => props.onAdd({ name, id, type, value })}
          iconId="check"
        />
      }
    />
  );
}
