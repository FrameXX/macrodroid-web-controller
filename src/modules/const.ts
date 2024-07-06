import { Target } from "framer-motion";
import { Action, ActionArgumentType } from "./action";

// URL
export const MACRODROID_WEBHOOK_DOMAIN = "trigger.macrodroid.com";
export const WEBHOOK_REQUEST_ID_PREFIX = "mdwc";
export const WEBHOOK_ADD_REQUEST_ID = "add";
export const CONNECTION_ID_PARAM_NAME = "connectionId";
export const REQUEST_ID_PARAM_NAME = "requestId";
export const NTFY_DOMAIN = "ntfy.sh";
export const NTFY_TOPIC_PREFIX = "macrodroid-wc";

// UI
export const SPLASHSCREEN_TIMEOUT_MS = 350;
export const DEFAULT_TRANSITION_OFFSET = 40;
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
export const LOG_RECORD_LIMIT = 60;

export const ACTIONS: Action[] = [
  {
    id: "set_global_variable",
    name: "Set global variable",
    iconId: "help",
    keywords: ["set", "global", "variable"],
    arguments: [
      { name: "Name", value: "", type: ActionArgumentType.String },
      {
        name: "Type",
        value: 0,
        type: ActionArgumentType.Selection,
        options: ["Boolean", "Integer", "String", "Decimal"],
      },
      {
        name: "Value",
        value: false,
        type: ActionArgumentType.Boolean,
        useCondition: { argumentIndex: 1, argumentValue: 0 },
      },
      {
        name: "Value",
        value: 0,
        type: ActionArgumentType.Int,
        useCondition: { argumentIndex: 1, argumentValue: 1 },
      },
      {
        name: "Value",
        value: "",
        type: ActionArgumentType.MultiLineString,
        useCondition: { argumentIndex: 1, argumentValue: 2 },
      },
      {
        name: "Value",
        value: 0,
        type: ActionArgumentType.Decimal,
        useCondition: { argumentIndex: 1, argumentValue: 3 },
      },
    ],
  },
  {
    id: "evaluate_magic_text",
    name: "Evaluate magic text",
    iconId: "code-json",
    arguments: [
      {
        name: "Text",
        description:
          "The entered text can provide MacroDroid magic text in the same format as in MacroDroid. For example both {battery} and [battery] should both be overwritten with battery level.",
        value: "",
        type: ActionArgumentType.String,
      },
    ],
    keywords: ["eval", "evaluate", "magic text", "expression", "variables"],
  },
  {
    id: "display_notification",
    name: "Display notification",
    iconId: "alert-circle-outline",
    arguments: [
      { name: "Title", value: "", type: ActionArgumentType.String },
      { name: "Text", value: "", type: ActionArgumentType.MultiLineString },
    ],
    keywords: ["alert", "notification"],
  },
  {
    id: "shell_script",
    name: "Shell script",
    iconId: "script-outline",
    arguments: [
      {
        name: "Use helper app",
        value: false,
        type: ActionArgumentType.Boolean,
      },
      { name: "Rooted", value: false, type: ActionArgumentType.Boolean },
      { name: "Command", value: "", type: ActionArgumentType.MultiLineString },
    ],
    keywords: ["alert", "notification"],
  },
];
