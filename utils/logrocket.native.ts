import LogRocket from "@logrocket/react-native";
import { Platform } from "react-native";

const LOGROCKET_APP_ID = process.env.EXPO_PUBLIC_LOGROCKET_APP_ID;
const isSupportedPlatform = Platform.OS === "ios" || Platform.OS === "android";
let isInitialized = false;

type LogRocketTrackProps = Parameters<typeof LogRocket.track>[1];
type LogRocketExtra = Record<string, string | number | boolean>;
type LogRocketUserTraits = Record<
  string,
  string | number | boolean | null | undefined
>;

export const initLogRocket = () => {
  if (isInitialized || !isSupportedPlatform || !LOGROCKET_APP_ID) return;

  LogRocket.init(LOGROCKET_APP_ID, {
    network: { isEnabled: true },
    console: { shouldAggregateConsoleErrors: true },
  });

  isInitialized = true;
};

const ensureInitialized = () => {
  if (isInitialized) return;
  initLogRocket();
};

export const trackLogRocketEvent = (
  eventName: string,
  properties?: LogRocketTrackProps
) => {
  ensureInitialized();
  if (!isInitialized) return;
  LogRocket.track(eventName, properties);
};

export const captureLogRocketMessage = (
  message: string,
  extra?: LogRocketExtra
) => {
  ensureInitialized();
  if (!isInitialized) return;
  LogRocket.captureMessage(message, extra ? { extra } : undefined);
};

export const captureLogRocketException = (
  error: unknown,
  extra?: LogRocketExtra
) => {
  ensureInitialized();
  if (!isInitialized) return;
  LogRocket.captureException(error, extra ? { extra } : undefined);
};

export const identifyLogRocketUser = (
  userId: string,
  traits?: LogRocketUserTraits
) => {
  ensureInitialized();
  if (!isInitialized || !userId) return;

  const sanitizedTraits: Record<string, string | number | boolean> = {};
  if (traits) {
    Object.entries(traits).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      sanitizedTraits[key] = value;
    });
  }

  if (Object.keys(sanitizedTraits).length) {
    LogRocket.identify(userId, sanitizedTraits);
    return;
  }

  LogRocket.identify(userId);
};

export const isLogRocketInitialized = () => isInitialized;
