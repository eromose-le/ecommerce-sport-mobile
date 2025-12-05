import { AppEnv } from "@/constants/env";
import { useAuth } from "@/providers/auth";
import { NotificationService } from "@/services/api";
import { Logger } from "@/utils/logger";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

// Ensure notifications display while app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ANDROID_CHANNEL_ID = "default";
const RESOLVED_PROJECT_ID =
  Constants?.expoConfig?.extra?.eas?.projectId ||
  Constants?.easConfig?.projectId ||
  // Constants?.expoConfig?.projectId
  null; // Replace with a fallback or valid property if needed

const getPermissionsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return "granted";

  const { status } = await Notifications.requestPermissionsAsync();
  return status;
};

const configureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
};

const registerExpoPushToken = async (authToken: string) => {
  if (Platform.OS === "web") {
    Logger.warn("Push", "Skipping push registration on web");
    return null;
  }

  if (!Constants.isDevice) {
    Logger.warn("Push", "Push notifications require a physical device");
    return null;
  }

  const permissionStatus = await getPermissionsAsync();
  if (permissionStatus !== "granted") {
    Logger.warn("Push", "Notification permission not granted");
    return null;
  }

  if (!RESOLVED_PROJECT_ID) {
    Logger.warn("Push", "Missing EAS project id for push registration");
    return null;
  }

  const expoToken = (
    await Notifications.getExpoPushTokenAsync({
      projectId: RESOLVED_PROJECT_ID,
    })
  ).data;

  await NotificationService.registerPushToken({
    token: expoToken,
    platform: Platform.OS,
    appVersion: Constants.expoConfig?.version ?? AppEnv.config.appVersion,
    authToken,
  });

  return expoToken;
};

export const usePushNotifications = () => {
  const { user, loading } = useAuth();
  const registeringRef = useRef(false);
  const registeredUserRef = useRef<string | null>(null);

  useEffect(() => {
    configureAndroidChannel().catch((error) =>
      Logger.warn("Push", "Failed to configure Android channel", error)
    );
  }, []);

  useEffect(() => {
    const authToken = user?.token;
    const userId = user?.id ? String(user.id) : null;

    if (loading) return;
    if (!authToken || !userId) {
      registeredUserRef.current = null;
      return;
    }

    if (registeredUserRef.current === userId || registeringRef.current) return;

    registeringRef.current = true;

    registerExpoPushToken(authToken)
      .then((token) => {
        if (token) {
          registeredUserRef.current = userId;
        }
      })
      .catch((error) => {
        Logger.warn("Push", "Push registration failed", error);
      })
      .finally(() => {
        registeringRef.current = false;
      });
  }, [loading, user?.id, user?.token]);
};
