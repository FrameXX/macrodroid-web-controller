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
export const DEFAULT_TRANSITION_TRANSLATE_PX = 40;
export const DEFAULT_TRANSITION_UNMOUNTED_SCALE = 0.8;
export const DEFAULT_TRANSITION_DURATION_S = 0.3;
const PREFERS_REDUCED_MOTION = matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const TRANSITION_BOUNCE = 0.45;
const TRANSITION_TYPE = "spring";
const TRANSITION_DURATION = PREFERS_REDUCED_MOTION
  ? 0.000001
  : DEFAULT_TRANSITION_DURATION_S;
export const TRANSITIONS = {
  duration: TRANSITION_DURATION,
  bounce: TRANSITION_BOUNCE,
  type: TRANSITION_TYPE,
} as const;
export const TOASTER_MAX_TOASTS = 3;
export const TOAST_START_DELAY_MS = 1400;
export const TOAST_MS_PER_CHAR = 70;
export const ANIMATE_SCALE_UNMOUNTED: Target = {
  opacity: 0,
  transform: `scale(${DEFAULT_TRANSITION_UNMOUNTED_SCALE})`,
} as const;
export const ANIMATE_SCALE_MOUNTED: Target = {
  opacity: 1,
  transform: "scale(1)",
} as const;

// OTHER
export const MACRODROID_APP_URL =
  "https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid";
export const LOG_RECORD_LIMIT = 40;
export const RECENT_ACTIONS_LIMIT = 20;
export const UKNOWN_REQUEST_COMMENT = "Unknown request";
export const NOTIFICATION_REQUEST_COMMENT = "Notification";
export const CLIPBOARD_FILL_REQUEST_COMMENT = "Clipboard fill";

export const CONNECTIONS_STORAGE_KEY = "connections";
export const LOG_RECORDS_STORAGE_KEY = "logRecords";
export const CUSTOM_ACTIONS_STORAGE_KEY = "customActions";
export const SAVED_ACTIONS_STORAGE_KEY = "savedActions";
export const RECENT_ACTIONS_STORAGE_KEY = "recentActions";

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
        type: ActionArgType.Integer,
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
    name: "Post notification",
    iconId: "alert-circle-outline",
    args: [
      { name: "Title", value: "", type: ActionArgType.String, id: "title" },
      {
        name: "Text",
        value: "",
        type: ActionArgType.MultiLineString,
        id: "text",
      },
      {
        name: "High priority",
        value: false,
        type: ActionArgType.Boolean,
        id: "high_priority",
      },
    ],
    keywords: ["alert", "notification"],
  },
  {
    id: "shell_script",
    name: "Run shell script",
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
  {
    id: "system_settings",
    name: "Set system settings",
    iconId: "cellphone-cog",
    args: [
      {
        name: "Table",
        value: 0,
        type: ActionArgType.Selection,
        options: ["System", "Secure", "Global"],
        id: "table",
      },
      {
        name: "Use helper app",
        value: true,
        type: ActionArgType.Boolean,
        id: "use_helper_app",
      },
      {
        name: "Key",
        value: "",
        type: ActionArgType.String,
        id: "key",
      },
      {
        name: "Value",
        value: "",
        type: ActionArgType.String,
        id: "value",
      },
      {
        name: "Value type",
        value: 0,
        type: ActionArgType.Selection,
        options: ["Integer", "Float", "Long", "String"],
        id: "value_type",
      },
    ],
    keywords: ["system", "settings"],
  },
  {
    id: "enable_wifi",
    name: "Enable Wi-Fi",
    iconId: "wifi",
    args: [],
    keywords: [
      "wifi",
      "wi-fi",
      "enable",
      "internet",
      "network",
      "connectivity",
      "lan",
    ],
  },
  {
    id: "disable_wifi",
    name: "Disable Wi-Fi",
    iconId: "wifi-off",
    args: [],
    keywords: [
      "wifi",
      "wi-fi",
      "disable",
      "internet",
      "network",
      "connectivity",
      "lan",
    ],
  },
  {
    id: "enable_bluetooth",
    name: "Enable Bluetooth",
    iconId: "bluetooth",
    args: [],
    keywords: ["bluetooth", "enable", "connectivity"],
  },
  {
    id: "disable_bluetooth",
    name: "Disable Bluetooth",
    iconId: "bluetooth-off",
    args: [],
    keywords: ["bluetooth", "disable", "connectivity"],
  },
  {
    id: "send_sms",
    name: "Send SMS",
    iconId: "message-processing",
    args: [
      {
        name: "Phone number",
        value: "",
        type: ActionArgType.String,
        id: "number",
      },
      {
        name: "Text",
        value: "",
        type: ActionArgType.MultiLineString,
        id: "text",
      },
      {
        name: "Prepopulate (Don't send)",
        value: false,
        type: ActionArgType.Boolean,
        id: "prepopulate",
      },
    ],
    keywords: ["sms", "text", "send", "message", "texting"],
  },
  {
    id: "simulate_audio_button",
    name: "Simulate audio button",
    iconId: "play-circle",
    args: [
      {
        name: "Action",
        value: 0,
        type: ActionArgType.Selection,
        options: ["Play/Pause", "Previous", "Next", "Play", "Pause", "Stop"],
        id: "action",
      },
    ],
    keywords: ["audio", "button", "media", "music", "player"],
  },
  {
    id: "enable_airplane_mode",
    name: "Enable airplane mode",
    iconId: "airplane",
    args: [
      {
        name: "Method",
        value: 0,
        type: ActionArgType.Selection,
        options: ["Default assistant", "ADB hack", "Root"],
        id: "method",
      },
    ],
    keywords: ["airplane", "mode", "enable"],
  },
  {
    id: "disable_airplane_mode",
    name: "Disable airplane mode",
    iconId: "airplane-off",
    args: [
      {
        name: "Method",
        value: 0,
        type: ActionArgType.Selection,
        options: ["MacroDroid as default assistant", "ADB hack", "Root"],
        id: "method",
      },
    ],
    keywords: ["airplane", "mode", "disable"],
  },
  {
    id: "disable_macrodroid",
    name: "Disable MacroDroid",
    iconId: "grid-off",
    args: [],
    keywords: ["macro", "droid", "disable", "turn off"],
  },
  {
    id: "run_macro",
    name: "Run Macro",
    iconId: "arrow-top-right",
    args: [
      { name: "Name", value: "", type: ActionArgType.String, id: "name" },
      {
        name: "Ignore constraints",
        value: true,
        type: ActionArgType.Boolean,
        id: "ignore_constraints",
      },
      {
        name: "Ignore macro disabled",
        value: true,
        type: ActionArgType.Boolean,
        id: "ignore_disabled",
      },
    ],
    keywords: ["macro", "droid", "run", "execute", "launch", "trigger"],
  },
  {
    id: "enable_location_services",
    name: "Enable location services",
    iconId: "map-marker",
    args: [],
    keywords: ["location", "services", "enable"],
  },
  {
    id: "disable_location_services",
    name: "Disable location services",
    iconId: "map-marker-off",
    args: [],
    keywords: ["location", "services", "disable"],
  },
  {
    id: "reboot",
    name: "Reboot",
    iconId: "reload",
    args: [
      {
        name: "Soft",
        value: false,
        type: ActionArgType.Boolean,
        id: "soft",
        description:
          "Soft restart will only halt the system to restart itself without it traditionally being started by the bootloader.",
      },
    ],
    keywords: ["restart", "reboot"],
  },
  {
    id: "power_off",
    name: "Power off",
    iconId: "power",
    args: [
      {
        name: "Alternative method",
        value: false,
        type: ActionArgType.Boolean,
        id: "alt_method",
      },
    ],
    keywords: ["power", "off", "shutdown"],
  },
  {
    id: "launch_app",
    name: "Launch app",
    iconId: "open-in-new",
    args: [
      {
        name: "Package name",
        value: "",
        type: ActionArgType.String,
        id: "package_name",
        description:
          "Package name is unique to every app unlike app name. You can usually find it in the system settings app info page. For example for MacroDroid it is com.arlosoft.macrodroid.",
      },
      {
        name: "Force new",
        value: false,
        type: ActionArgType.Boolean,
        id: "force_new",
      },
      {
        name: "Exclude from recents",
        value: false,
        type: ActionArgType.Boolean,
        id: "exclude_from_recents",
      },
    ],
    keywords: ["app", "open", "launch", "application", "start"],
  },
  {
    id: "enable_flashlight",
    name: "Enable flashlight",
    iconId: "flashlight",
    args: [],
    keywords: ["flashlight", "enable", "torch", "light"],
  },
  {
    id: "disable_flashlight",
    name: "Disable flashlight",
    iconId: "flashlight-off",
    args: [],
    keywords: ["flashlight", "disable", "torch", "light"],
  },
] as const;

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
  { title: "Last known location (lat, lon)", magicText: "last_loc_latlong" },
  { title: "Last known location (lat)", magicText: "last_loc_lat" },
  { title: "Last known location (lon)", magicText: "last_loc_lon" },
  { title: "Last known location (altitude)", magicText: "last_loc_alt" },
  { title: "Last known location (accuracy)", magicText: "last_loc_accuracy" },
  {
    title: "Last known location (google maps link)",
    magicText: "last_loc_link",
  },
  { title: "Last known location (time)", magicText: "last_loc_age_timestamp" },
  {
    title: "Last known location (speed km/h)",
    magicText: "last_loc_speed_kmh",
  },
  {
    title: "Last known location (speed mph)",
    magicText: "last_loc_speed_mph",
  },
  {
    title: "Current volume (Alarm)",
    magicText: "vol_alarm",
  },
  {
    title: "Current volume (Media/Music)",
    magicText: "vol_music",
  },
  {
    title: "Current volume (Ringer)",
    magicText: "vol_ring",
  },
  {
    title: "Current volume (Notification)",
    magicText: "vol_notif",
  },
  {
    title: "Current volume (System)",
    magicText: "vol_system",
  },
  {
    title: "Current volume (Voice)",
    magicText: "vol_call",
  },
  {
    title: "Current volume (Bluetooth voice)",
    magicText: "vol_bt_voice",
  },
  {
    title: "Device name",
    magicText: "device_name",
  },
  {
    title: "Device uptime",
    magicText: "uptime",
  },
  {
    title: "Device uptime (s)",
    magicText: "uptime_secs",
  },
  {
    title: "Device manufacturer",
    magicText: "device_manufacturer",
  },
  {
    title: "Device model",
    magicText: "device_model",
  },
  {
    title: "MacroDroid version",
    magicText: "macrodroid_version",
  },
  {
    title: "MacroDroid is pro",
    magicText: "macrodroid_is_pro",
  },
  {
    title: "Android version",
    magicText: "android_version",
  },
  {
    title: "Android version (SDK)",
    magicText: "android_version_sdk",
  },
  {
    title: "SIM operator name",
    magicText: "sim_operator_name",
  },
  {
    title: "SIM 2 operator name",
    magicText: "sim2_operator_name",
  },
  {
    title: "Screen resolution",
    magicText: "screen_res",
  },
  {
    title: "Screen resolution (X)",
    magicText: "screen_res_x",
  },
  {
    title: "Screen resolution (Y)",
    magicText: "screen_res_y",
  },
  {
    title: "RAM (total)",
    magicText: "ram_total",
  },
  {
    title: "RAM (available)",
    magicText: "ram_available",
  },
  {
    title: "Storage total (external)",
    magicText: "storage_external_total",
  },
  {
    title: "Storage free (external)",
    magicText: "storage_external_free",
  },
  {
    title: "Storage total (internal)",
    magicText: "storage_internal_total",
  },
  {
    title: "Storage free (internal)",
    magicText: "storage_internal_free",
  },
] as const;
