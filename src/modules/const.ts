import { Target } from "framer-motion";
import { Action, ActionArgType } from "./action";
import { MagicTextEntryProps } from "../components/MagicTextEntry/MagicTextEntry";

// URL
export const COMPANION_MACRO_FILENAME = "companion.macro";
export const MACRODROID_WEBHOOK_DOMAIN = "trigger.macrodroid.com";
export const WEBHOOK_REQUEST_ID_PREFIX = "mdwc";
export const WEBHOOK_ADD_REQUEST_ID = "add";
export const CONNECTION_ID_PARAM_NAME = "connectionId";
export const REQUEST_ID_PARAM_NAME = "requestId";
export const NTFY_DOMAIN = "ntfy.sh";
export const NTFY_TOPIC_PREFIX = "macrodroid-wc";
export const CONFIRM_CONNECTION_REQUEST_COMMENT =
  "Connection creation confirmation";

// UI
export const SPLASHSCREEN_TIMEOUT_MS = 350;
export const DEFAULT_TRANSITION_OFFSET_PX = 40;
export const DEFAULT_TRANSITION_UNMOUNTED_SCALE = 0.8;
export const DEFAULT_TRANSITION_DURATION_S = 0.35;
const PREFERS_REDUCED_MOTION = matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
export const TRANSITIONS = {
  duration: PREFERS_REDUCED_MOTION ? 0.000001 : DEFAULT_TRANSITION_DURATION_S,
  bounce: 0.4,
  type: "spring",
} as const;
export const TOASTER_MAX_TOASTS = 3;
export const TOAST_START_DELAY_MS = 3000;
export const TOAST_MS_PER_CHAR = 70;
export const ANIMATE_SCALE_UNMOUNTED: Target = {
  opacity: 0,
  transform: `scale(${DEFAULT_TRANSITION_UNMOUNTED_SCALE})`,
};
export const ANIMATE_SCALE_MOUNTED: Target = {
  opacity: 1,
  transform: "scale(1)",
};

// OTHER
export const MACRODROID_APP_URL =
  "https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid";
export const LOG_RECORD_LIMIT = 40;
export const RECENT_ACTIONS_LIMIT = 20;

export const ACTIONS: Action[] = [
  {
    id: "set_global_variable",
    name: "Set global variable",
    iconId: "help",
    keywords: ["set", "global", "variable"],
    args: [
      { name: "Name", value: "", type: ActionArgType.String, id: "name" },
      {
        name: "Type",
        value: 0,
        type: ActionArgType.Selection,
        options: ["Boolean", "Integer", "String", "Decimal"],
        id: "type",
      },
      {
        name: "Value",
        value: false,
        type: ActionArgType.Boolean,
        useCondition: { argumentIndex: 1, argumentValue: 0 },
        id: "value",
      },
      {
        name: "Value",
        value: 0,
        type: ActionArgType.Int,
        useCondition: { argumentIndex: 1, argumentValue: 1 },
        id: "value",
      },
      {
        name: "Value",
        value: "",
        type: ActionArgType.MultiLineString,
        useCondition: { argumentIndex: 1, argumentValue: 2 },
        id: "value",
      },
      {
        name: "Value",
        value: 0,
        type: ActionArgType.Decimal,
        useCondition: { argumentIndex: 1, argumentValue: 3 },
        id: "value",
      },
    ],
  },
  {
    id: "evaluate_magic_text",
    name: "Evaluate magic text",
    iconId: "code-json",
    args: [
      {
        name: "Text",
        description:
          "The entered text can provide MacroDroid magic text in the same format as in MacroDroid. For example both {battery} and [battery] should both be overwritten with battery level.",
        value: "",
        type: ActionArgType.String,
        id: "text",
      },
    ],
    keywords: ["eval", "evaluate", "magic text", "expression", "variables"],
  },
  {
    id: "display_notification",
    name: "Display notification",
    iconId: "alert-circle-outline",
    args: [
      { name: "Title", value: "", type: ActionArgType.String, id: "title" },
      {
        name: "Text",
        value: "",
        type: ActionArgType.MultiLineString,
        id: "text",
      },
    ],
    keywords: ["alert", "notification"],
  },
  {
    id: "shell_script",
    name: "Shell script",
    iconId: "script-outline",
    args: [
      {
        name: "Environment",
        value: false,
        type: ActionArgType.Selection,
        options: ["Rooted", "Non-rooted", "Shizuku"],
        id: "environment",
      },
      {
        name: "Use helper app",
        value: false,
        type: ActionArgType.Boolean,
        id: "use_helper_app",
      },
      {
        name: "Script",
        value: "",
        type: ActionArgType.MultiLineString,
        id: "script",
      },
    ],
    keywords: ["alert", "notification"],
  },
  {
    id: "fill_clipboard",
    name: "Fill clipboard",
    iconId: "clipboard-text",
    args: [
      {
        name: "Text",
        value: "",
        type: ActionArgType.MultiLineString,
        id: "text",
      },
    ],
    keywords: ["clipboard", "copy", "fill", "paste", "write"],
  },
];

export const MAGIC_TEXT_ENTRIES: MagicTextEntryProps[] = [
  { title: "MacroDroid Mode", magicText: "mode" },
  { title: "Foreground app name", magicText: "fg_app_name" },
  { title: "Foreground app package", magicText: "fg_app_package" },
  { title: "Current brightness", magicText: "current_brightness" },
  {
    title: "Current brightness (Android 9+ alternative)",
    magicText: "current_brightness_alternative",
  },
  { title: "Screen timeout (seconds)", magicText: "screen_timeout" },
  { title: "Current battery (%)", magicText: "battery" },
  { title: "Battery temperature (°C)", magicText: "battery_temp" },
  { title: "Battery current now (mA)", magicText: "battery_current_now" },
  { title: "Power (On/Off)", magicText: "power" },
  { title: "Clipboard text", magicText: "clipboard" },
  { title: "Current IP address", magicText: "ip" },
  { title: "Current IP address (V6)", magicText: "ip6" },
  { title: "Wi-Fi SSID", magicText: "ssid" },
  { title: "Wi-Fi signal strength", magicText: "wifi_strength" },
  { title: "Cell tower signal strength", magicText: "cell_signal_strength" },
  { title: "Day of the week", magicText: "dayofweek" },
  { title: "Day of the month", magicText: "dayofmonth" },
  { title: "Week of the year", magicText: "week_of_year" },
  { title: "Month", magicText: "month" },
  { title: "Month (as digit)", magicText: "month_digit" },
  { title: "Year", magicText: "year" },
  { title: "Hour of day", magicText: "hour" },
  { title: "Hour of day (leading zero)", magicText: "hour_0" },
  { title: "Hour of day (12h)", magicText: "hour12" },
  { title: "Minute", magicText: "minute" },
  { title: "Second", magicText: "second" },
  { title: "am/pm", magicText: "am_pm" },
  { title: "System time", magicText: "system_time" },
  { title: "System time (ms)", magicText: "system_time_ms" },
  { title: "Webhook base URL", magicText: "webhook_url" },
  { title: "Language code", magicText: "language_code" },
  { title: "Country code", magicText: "country_code" },
  { title: "Cell connection type", magicText: "cell_connection_type" },
  { title: "Mobile country code", magicText: "mcc" },
  { title: "Mobile network code", magicText: "mnc" },
  { title: "Location area code", magicText: "lac" },
  { title: "Cell tower ID", magicText: "cell_id" },
];
