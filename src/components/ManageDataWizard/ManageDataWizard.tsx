import { useImmer } from "use-immer";
import { Confirm } from "../../modules/confirm_dialog";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { R_Button } from "../Button/Button";
import { R_FAB } from "../FAB/FAB";
import { R_Wizard } from "../Wizard/Wizard";
import "./ManageDataWizard.scss";
import { useKey } from "../../modules/use_key";
import { R_InfoCard } from "../InfoCard/InfoCard";
import {
  CONNECTIONS_STORAGE_KEY,
  CUSTOM_ACTIONS_STORAGE_KEY,
  LOG_RECORDS_STORAGE_KEY,
  RECENT_ACTIONS_STORAGE_KEY,
  SAVED_ACTIONS_STORAGE_KEY,
} from "../../modules/const";
import { BakeToast, ToastSeverity } from "../../modules/toaster";
import { array, assert, size, string } from "superstruct";
import { stringifyError } from "../../modules/misc";

interface ManageDataWizardProps {
  bakeToast: BakeToast;
  confirm: Confirm;
  open: boolean;
  onClose: () => unknown;
}

const exportedDataStruct = array(size(array(string()), 2, 2));

export function R_ManageDataWizard(props: ManageDataWizardProps) {
  const [exportConnections, setExportConnections] = useImmer(true);
  const [exportCustomActions, setExportCustomActions] = useImmer(true);
  const [exportSavedActions, setExportSavedActions] = useImmer(true);
  const [exportRecentActions, setExportRecentActions] = useImmer(true);
  const [exportLogs, setExportLogs] = useImmer(true);

  useKey("Escape", props.onClose);

  function downloadBlob(blob: Blob) {
    const downloadURL = URL.createObjectURL(blob);
    const date = new Date();
    const fileName = `macrodroid_wc_data_${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;

    const link = document.createElement("a");
    link.style.visibility = "hidden";
    link.href = downloadURL;
    link.download = fileName;
    document.body.prepend(link);
    link.click();
    link.remove();
  }

  function exportData() {
    const exportKeys: string[] = [];
    if (exportConnections) exportKeys.push(CONNECTIONS_STORAGE_KEY);
    if (exportCustomActions) exportKeys.push(CUSTOM_ACTIONS_STORAGE_KEY);
    if (exportSavedActions) exportKeys.push(SAVED_ACTIONS_STORAGE_KEY);
    if (exportRecentActions) exportKeys.push(RECENT_ACTIONS_STORAGE_KEY);
    if (exportLogs) exportKeys.push(LOG_RECORDS_STORAGE_KEY);

    const entries = Object.entries(localStorage).filter((entry) =>
      exportKeys.includes(entry[0]),
    );
    const entriesJSON = JSON.stringify(entries);
    const blob = new Blob([entriesJSON], { type: "application/json" });
    downloadBlob(blob);
  }

  function requestFile(): Promise<null | File> {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.multiple = false;
    input.style.position = "absolute";
    input.style.visibility = "hidden";
    document.body.prepend(input);
    input.click();
    return new Promise((resolve: (file: null | File) => void) => {
      input.addEventListener("cancel", () => {
        resolve(null);
        input.remove();
      });
      input.addEventListener("change", () => {
        if (!input.files) {
          resolve(null);
        } else if (input.files.length === 0) {
          resolve(null);
        } else {
          resolve(input.files[0]);
        }
        input.remove();
      });
    });
  }

  async function importData() {
    const file = await requestFile();
    if (!file) {
      props.bakeToast({
        message: "File import was canceled.",
        iconId: "file-cancel",
      });
      return;
    }

    let text: string;
    try {
      text = await file.text();
    } catch (error) {
      const errorMessage = `Failed to read file. ${stringifyError(error)}`;
      props.bakeToast({
        message: errorMessage,
        iconId: "file-alert",
        severity: ToastSeverity.Error,
      });
      return;
    }

    let entries: unknown;
    try {
      entries = JSON.parse(text);
    } catch (error) {
      const errorMessage = `Failed to parse file data. ${stringifyError(error)}`;
      props.bakeToast({
        message: errorMessage,
        iconId: "file-alert",
        severity: ToastSeverity.Error,
      });
      return;
    }

    try {
      assert(entries, exportedDataStruct);
    } catch (error) {
      const errorMessage = `The file structure could not be verified. ${stringifyError(error)}`;
      props.bakeToast({
        message: errorMessage,
        iconId: "file-alert",
        severity: ToastSeverity.Error,
      });
      return;
    }

    for (const entry of entries) {
      const key = entry[0];
      const value = entry[1];
      localStorage.setItem(key, value);
    }

    location.reload();
  }

  async function clearAllData() {
    const confirmed = await props.confirm(
      "Are you sure you want to delete all data from the local storage? Everything that wasn't exported beforehand will be lost.",
    );
    if (!confirmed) return;
    localStorage.clear();
    location.reload();
  }

  return (
    <R_Wizard
      activePageIndex={0}
      open={props.open}
      id="manage-data-wizard"
      pages={[
        <>
          <h2>Data management</h2>
          <R_BooleanOption
            title="Export connections"
            iconId="transit-connection-variant"
            value={exportConnections}
            onChange={setExportConnections}
          />
          <R_BooleanOption
            title="Export custom actions"
            iconId="play"
            value={exportCustomActions}
            onChange={setExportCustomActions}
          />
          <R_BooleanOption
            title="Export saved actions"
            iconId="star"
            value={exportSavedActions}
            onChange={setExportSavedActions}
          />
          <R_BooleanOption
            title="Export recent actions"
            iconId="history"
            value={exportRecentActions}
            onChange={setExportRecentActions}
          />
          <R_BooleanOption
            title="Export logs"
            iconId="text-box"
            value={exportLogs}
            onChange={setExportLogs}
          />
          <R_InfoCard id="data-import-notice">
            When importing an exported file, only data included in the export
            will be overwritten. For example if you exported only connections
            your current connections will be replaced with the ones from the
            imported file. Your saved actions and any other data won't be
            touched. Other data will be left unchanged. The page will be
            reloaded after import.
          </R_InfoCard>
          <div className="actions">
            <R_Button
              text="Export data"
              title="Export data"
              iconId="database-export"
              onClick={exportData}
            />
            <R_Button
              text="Import data"
              title="Import data"
              iconId="database-import"
              onClick={importData}
            />
            <R_Button
              text="Clear all data"
              title="Clear all data"
              iconId="delete-forever"
              onClick={clearAllData}
            />
          </div>
        </>,
      ]}
      rightButton={
        <R_FAB title="Close" onClick={props.onClose} iconId="close" />
      }
    />
  );
}
