import { AppEnv } from "@/constants/env";
import { useAuth } from "@/providers/auth";
import { NotificationService } from "@/services/api";
import { Logger } from "@/utils/logger";
import Constants from "expo-constants";
import type { Subscription } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

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

const resolveProjectId = () =>
  Constants?.expoConfig?.extra?.eas?.projectId ||
  Constants?.easConfig?.projectId ||
  (Constants?.expoConfig as any)?.projectId ||
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID ||
  null;

const isExpoPushToken = (token: string) =>
  /^Expo(Push)?Token\[[A-Za-z0-9-]+\]$/.test(token);

const configureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
};

const registerForPushNotificationsAsync = async (
  authToken: string
): Promise<string | null> => {
  if (Platform.OS === "web") {
    Logger.warn("Push", "Skipping push registration on web");
    return null;
  }

  // if (!Device.isDevice) {
  //   Logger.warn("Push", "Must use a physical device for push notifications");
  //   return null;
  // }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const { status: finalStatus } =
    existingStatus === "granted"
      ? { status: existingStatus }
      : await Notifications.requestPermissionsAsync();

  if (finalStatus !== "granted") {
    Logger.warn("Push", "Notification permission not granted");
    return null;
  }

  const projectId = resolveProjectId();
  if (!projectId) {
    Logger.warn(
      "Push",
      "Missing EAS project id; set extra.eas.projectId in app.json/app.config"
    );
    return null;
  }

  let expoToken: string;
  try {
    expoToken = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
  } catch (error: any) {
    Logger.warn(
      "Push",
      "Failed to get Expo push token (simulator/emulator likely)",
      error?.message || error
    );
    return null;
  }

  Logger.info("Push", "Expo token acquired", {
    projectId,
    platform: Platform.OS,
    tokenPreview: `${expoToken.slice(0, 8)}...`,
  });

  // if (!isExpoPushToken(expoToken)) {
  //   Logger.warn("Push", "Skipping registration; token is not Expo format", {
  //     expoToken,
  //   });
  //   return null;
  // }

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
  const receivedSubRef = useRef<Subscription | null>(null);
  const responseSubRef = useRef<Subscription | null>(null);

  useEffect(() => {
    configureAndroidChannel().catch((error) =>
      Logger.warn("Push", "Failed to configure Android channel", error)
    );
  }, []);

  useEffect(() => {
    receivedSubRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        Logger.info(
          "Push",
          "Notification received",
          notification.request.content
        );
      }
    );

    responseSubRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        Logger.info(
          "Push",
          "Notification tapped",
          response.notification.request.content.data
        );
      });

    return () => {
      receivedSubRef.current?.remove();
      responseSubRef.current?.remove();
    };
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

    registerForPushNotificationsAsync(authToken)
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
