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
