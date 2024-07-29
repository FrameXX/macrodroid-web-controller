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
import "./CreateArgumentWizard.scss";
import { R_IconNotice } from "../IconNotice/IconNotice";
import { R_Accordion } from "../Accordion/Accordion";
import { R_SelectOptionCard } from "../SelectOptionCard/SelectOptionCard";
import { AnimatePresence, motion } from "framer-motion";
import { Random } from "../../modules/random";
import { moveElement } from "../../modules/misc";
import { useRef } from "react";
import { useColumnDeterminator } from "../../modules/use_column_determinator";
import { useKey } from "../../modules/use_key";

interface AddArgumentWizardProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (arg: ActionArg<any>) => void;
}

const defaultValueInputIconId = "help";

export function R_CreateArgumentWizard(props: AddArgumentWizardProps) {
  const [name, setName] = useImmer("");
  const [id, setId] = useImmer("");
  const [type, setType] = useImmer<ActionArgType>(0);
  const [booleanValue, setBooleanValue] = useImmer(false);
  const [integerValue, setIntegerValue] = useImmer(0);
  const [selectionValue, setSelectionValue] = useImmer(0);
  const [stringValue, setStringValue] = useImmer("");
  const [multiLineStringValue, setMultiLineStringValue] = useImmer("");
  const [decimalValue, setDecimalValue] = useImmer(0);
  const [selectOptions, setSelectOptions] = useImmer<SelectOption[]>([]);
  const container = useRef(null);

  interface SelectOption {
    id: number;
    title: string;
    valid: boolean;
  }

  // @ts-ignore
  function reset() {
    setName("");
    setId("");
    setType(0);
    setBooleanValue(false);
    setIntegerValue(0);
    setSelectionValue(0);
    setStringValue("");
    setMultiLineStringValue("");
    setDecimalValue(0);
    setSelectOptions([]);
  }

  function addNewOption() {
    setSelectOptions((draft) => {
      draft.push({ id: Random.id(), title: "", valid: false });
      return draft;
    });
  }

  function deleteSelectOption(index: number) {
    setSelectOptions((draft) => {
      draft.splice(index, 1);
      return draft;
    });
  }

  function moveDownSelectOption(index: number) {
    setSelectOptions((draft) => {
      moveElement(draft, index, index + 1);
      return draft;
    });
  }

  function moveUpSelectOption(index: number) {
    setSelectOptions((draft) => {
      moveElement(draft, index, index - 1);
      return draft;
    });
  }

  function handleSelectOptionChange(
    index: number,
    newValue: string,
    validity: boolean,
  ) {
    setSelectOptions((draft) => {
      draft[index].title = newValue;
      draft[index].valid = validity;
      return draft;
    });
  }

  function argumentValid() {
    if (!name) return false;
    if (!id) return false;
    if (
      type === ActionArgType.Selection &&
      (!selectOptions.length ||
        selectOptions.findIndex((option) => !option.valid) !== -1)
    )
      return false;
    return true;
  }

  function getRelevantValue() {
    switch (type) {
      case ActionArgType.Boolean:
        return booleanValue;
      case ActionArgType.Integer:
        return integerValue;
      case ActionArgType.Selection:
        return selectionValue;
      case ActionArgType.String:
        return stringValue;
      case ActionArgType.MultiLineString:
        return multiLineStringValue;
      case ActionArgType.Decimal:
        return decimalValue;
    }
  }

  function handleAddArgument() {
    const value = getRelevantValue();
    props.onCreate({ name, id, type, value });
  }

  const columns = useColumnDeterminator(container, new Array(5), 350);

  useKey("Escape", props.onCancel);

  return (
    <R_Wizard
      activePageIndex={0}
      open={props.open}
      pages={[
        <>
          <h2>Add argument</h2>
          <motion.div ref={container} animate={{ columnCount: columns }}>
            <R_StringOption
              onChange={setName}
              required
              title="Name"
              iconId="rename"
              description="The name of the argument shown in the web UI"
            />
            <R_StringOption
              onChange={setId}
              required
              title="ID"
              iconId="identifier"
              description="The ID of the argument that will be send to MacroDroid"
            />
            <R_StringOption
              onChange={setName}
              title="Description"
              iconId="rename"
              description="Describe what is the argument for. This is not required."
            />
            <R_SelectOption
              iconId="alpha-t-box"
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
              iconId={defaultValueInputIconId}
              value={booleanValue}
              onChange={setBooleanValue}
              hidden={type !== ActionArgType.Boolean}
              title="Default value"
            />
            <R_NumberOption
              required
              iconId={defaultValueInputIconId}
              value={integerValue}
              onChange={setIntegerValue}
              hidden={type !== ActionArgType.Integer}
              title="Default value"
            />
            <R_NumberOption
              required
              iconId={defaultValueInputIconId}
              value={selectionValue}
              onChange={setSelectionValue}
              hidden={type !== ActionArgType.Selection}
              title="Default value"
            />
            <R_StringOption
              iconId={defaultValueInputIconId}
              value={stringValue}
              onChange={setStringValue}
              hidden={type !== ActionArgType.String}
              title="Default value"
            />
            <R_MultiLineStringOption
              iconId={defaultValueInputIconId}
              value={multiLineStringValue}
              onChange={setMultiLineStringValue}
              hidden={type !== ActionArgType.MultiLineString}
              title="Default value"
            />
            <R_NumberOption
              required
              decimal
              iconId={defaultValueInputIconId}
              value={decimalValue}
              onChange={setDecimalValue}
              hidden={type !== ActionArgType.Decimal}
              title="Default value"
            />
          </motion.div>
          <R_Accordion open={type == ActionArgType.Selection}>
            <br />
            <hr />
            <h2>Select options</h2>
            <R_IconNotice hidden={selectOptions.length > 0}>
              No options configured
            </R_IconNotice>
            <div>
              <AnimatePresence>
                {selectOptions.map((option, index) => (
                  <R_SelectOptionCard
                    title={option.title}
                    key={option.id}
                    index={index}
                    onChange={(value, validity) => {
                      handleSelectOptionChange(index, value, validity);
                    }}
                    onDelete={() => {
                      deleteSelectOption(index);
                    }}
                    onMoveDown={() => {
                      moveDownSelectOption(index);
                    }}
                    onMoveUp={() => {
                      moveUpSelectOption(index);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
            <R_Button
              iconId="plus"
              title="Add option"
              text="Add option"
              onClick={addNewOption}
            />
            <div></div>
          </R_Accordion>
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
          hidden={!argumentValid()}
          title="Add argument"
          onClick={handleAddArgument}
          iconId="check"
        />
      }
    />
  );
}
