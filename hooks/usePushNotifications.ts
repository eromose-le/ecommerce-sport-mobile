import { AppEnv } from "@/constants/env";
import { useAuth } from "@/providers/auth";
import { NotificationService } from "@/services/api";
import { Logger } from "@/utils/logger";
import { trackLogRocketEvent } from "@/utils/logrocket.native";
import { AppToast } from "@/utils/toast";
import Constants from "expo-constants";
import * as Device from "expo-device";
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

// const isExpoPushToken = (token: string) =>
//   /^Expo(Push)?Token\[[A-Za-z0-9-]+\]$/.test(token);

export const configureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
};

export const registerForPushNotificationsAsync = async (
  authToken: string
): Promise<string | null> => {
  Logger.error("1", 1);
  if (Platform.OS === "web") {
    Logger.warn("Push", "Skipping push registration on web");
    return null;
  }

  const deviceInfo = {
    deviceIsPhysical: Device.isDevice,
    deviceName: Device.deviceName,
    deviceType: Device.deviceType,
    deviceBrand: Device.brand,
  };

  Logger.error("2", 2);
  // if (!Device.isDevice) {
  //   AppToast.failed(
  //     `Must use a physical device for push notifications ${JSON.stringify(deviceInfo)}`
  //   );
  //   trackLogRocketEvent("Device.Info", deviceInfo);
  //   Logger.warn(
  //     "Push",
  //     "Must use a physical device for push notifications",
  //     deviceInfo
  //   );

  //   throw new Error(
  //     `Push notifications require a physical device - ${deviceInfo.deviceBrand} ${deviceInfo.deviceType} (${deviceInfo.deviceName})`
  //   );
  // }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const { status: finalStatus } =
    existingStatus === "granted"
      ? { status: existingStatus }
      : await Notifications.requestPermissionsAsync();

  if (finalStatus !== "granted") {
    trackLogRocketEvent("Push.PermissionDenied", {
      platform: Platform.OS,
      status: finalStatus,
    });
    Logger.warn("Push", "Notification permission not granted", deviceInfo);
    AppToast.pending(
      `Notification permission not granted ${JSON.stringify(deviceInfo)}`
    );
    return null;
  }
  Logger.error("3", 3);

  const projectId = resolveProjectId();
  if (!projectId) {
    trackLogRocketEvent("Push.MissingProjectId", { platform: Platform.OS });
    Logger.warn(
      "Push",
      "Missing EAS project id; set extra.eas.projectId in app.json/app.config"
    );
    return null;
  }

  let apnDeviceToken: string = "";
  let expoDeviceToken: string = "";

  Logger.error("4", 4);
  try {
    expoDeviceToken = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    trackLogRocketEvent("Push.expoDeviceToken", {
      expoDeviceToken,
      apnDeviceToken,
      projectId,
    });
  } catch (error: any) {
    trackLogRocketEvent("Push.TokenFetchExpoFailed", {
      projectId,
      platform: Platform.OS,
      deviceIsPhysical: Device.isDevice,
      deviceName: Device.deviceName,
      deviceType: Device.deviceType,
      deviceBrand: Device.brand,
      expoDeviceToken,
      apnDeviceToken,
      errorLog: JSON.stringify(error),
    });
    Logger.warn(
      "Push",
      "Failed to get old Expo push token (pre SDK 49)",
      error
    );
  }

  // try {
  //   apnDeviceToken = (await Notifications.getDevicePushTokenAsync()).data;
  //   trackLogRocketEvent("Push.apnDeviceToken", {
  //     apnDeviceToken,
  //     expoDeviceToken,
  //     projectId,
  //   });
  // } catch (error: any) {
  //   trackLogRocketEvent("Push.TokenFetchApnFailed", {
  //     projectId,
  //     platform: Platform.OS,
  //     deviceIsPhysical: Device.isDevice,
  //     deviceName: Device.deviceName,
  //     deviceType: Device.deviceType,
  //     deviceBrand: Device.brand,
  //     expoDeviceToken,
  //     apnDeviceToken,
  //     errorLog: JSON.stringify(error),
  //   });
  //   Logger.warn(
  //     "Push",
  //     "Failed to get Expo push token (simulator/emulator likely)",
  //     error?.message || error
  //   );
  // }
  Logger.error("5", 5);

  // const expoDeviceTokenPreview = `${apnDeviceToken.slice(0, 8)}...`;
  // const apnDeviceTokenPreview = `${expoDeviceToken.slice(0, 8)}...`;
  const expoDeviceTokenPreview = expoDeviceToken;
  const apnDeviceTokenPreview = apnDeviceToken;
  Logger.info("Push", "Expo token acquired", {
    projectId,
    platform: Platform.OS,
    expoDeviceTokenPreview,
    apnDeviceTokenPreview,
  });
  trackLogRocketEvent("Push.TokenAcquired", {
    platform: Platform.OS,
    expoDeviceTokenPreview,
    apnDeviceTokenPreview,
  });

  // if (!isExpoPushToken(expoDeviceToken)) {
  //   Logger.warn("Push", "Skipping registration; token is not Expo format", {
  //     expoDeviceToken,
  //   });
  //   return null;
  // }

  try {
    Logger.error("6", 6, expoDeviceToken);
    const result: any =
      (await NotificationService.registerPushToken({
        // TODO: send both tokens to support legacy Expo tokens
        token: expoDeviceToken,
        platform: Platform.OS,
        appVersion: Constants.expoConfig?.version ?? AppEnv.config.appVersion,
        authToken,
      })) ?? null;
    trackLogRocketEvent("Push.TokenRegistered", {
      platform: Platform.OS,
      expoDeviceTokenPreview,
    });

    Logger.success("registerPushToken - result", result?.data);

    return result.data.success;
  } catch (error) {
    Logger.error("7", 7);
    trackLogRocketEvent("Push.TokenRegistrationFailed", {
      platform: Platform.OS,
    });
    throw error;
  }
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
        const content = notification.request.content;
        const rawData = content.data ?? {};
        const data =
          typeof rawData === "object" && rawData !== null ? rawData : {};
        const dataKeys = Object.keys(data);
        const bodyPreview = content.body ? content.body.slice(0, 80) : "";
        trackLogRocketEvent("Push.Received", {
          title: content.title ?? "",
          bodyPreview,
          hasData: dataKeys.length > 0,
          dataKeys,
        });
        Logger.info(
          "Push",
          "Notification received",
          notification.request.content
        );
      }
    );

    responseSubRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const content = response.notification.request.content;
        const rawData = content.data ?? {};
        const data =
          typeof rawData === "object" && rawData !== null ? rawData : {};
        const dataKeys = Object.keys(data);
        trackLogRocketEvent("Push.Tapped", {
          actionIdentifier: response.actionIdentifier,
          title: content.title ?? "",
          hasData: dataKeys.length > 0,
          dataKeys,
        });
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
