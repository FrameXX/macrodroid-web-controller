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
export const DEFAULT_TRANSITION_DURATION_S = 0.4;
const PREFERS_REDUCED_MOTION = matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
export const TRANSITIONS = {
  duration: PREFERS_REDUCED_MOTION ? 0.000001 : DEFAULT_TRANSITION_DURATION_S,
  bounce: 0.4,
  type: "spring",
} as const;

// OTHER
export const MACRODROID_APP_URL =
  "https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid";
export const LOG_RECORD_LIMIT = 60;

export const ACTIONS: Action[] = [
  {
    name: "Set global variable",
    iconId: "help",
    args: [
      { name: "Name", value: "", type: ActionArgumentType.String },
      {
        name: "Type",
        value: 0,
        type: ActionArgumentType.Selection,
        options: ["boolean", "integer", "string", "decimal"],
      },
      {
        name: "Value",
        value: false,
        type: ActionArgumentType.Boolean,
        use: { argumentIndex: 2, argumentValue: "boolean" },
      },
      {
        name: "Value",
        value: 0,
        type: ActionArgumentType.Int,
        use: { argumentIndex: 2, argumentValue: "integer" },
      },
      {
        name: "Value",
        value: "",
        type: ActionArgumentType.String,
        use: { argumentIndex: 2, argumentValue: "string" },
      },
      {
        name: "Value",
        value: 0,
        type: ActionArgumentType.Decimal,
        use: { argumentIndex: 2, argumentValue: "decimal" },
      },
    ],
  },
  {
    name: "Evaluate magic text",
    iconId: "code-json",
    args: [{ name: "Text", value: "", type: ActionArgumentType.String }],
  },
];
