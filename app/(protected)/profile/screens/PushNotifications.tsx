import ScrollableForm from "@/components/common/ScrollableForm";
import { BodyText, PrimaryButton } from "@/components/ui";
import {
  configureAndroidChannel,
  registerForPushNotificationsAsync,
} from "@/hooks/usePushNotifications";
import { useAuth } from "@/providers/auth";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { NotificationService } from "@/services/api";
import { Logger } from "@/utils/logger";
import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, Switch, View } from "react-native";

const PushNotifications = () => {
  const { user } = useAuth();
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  const [permissionStatus, setPermissionStatus] =
    useState<Notifications.PermissionStatus | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [sendingTestPush, setSendingTestPush] = useState(false);

  const refreshPermission = useCallback(async () => {
    try {
      const response = await Notifications.getPermissionsAsync();
      setPermissionStatus(response.status);
      setCanAskAgain(response.canAskAgain ?? true);
    } catch (error: any) {
      setPermissionStatus(null);
      setCanAskAgain(true);
      Logger.error("PushNotifications", "refreshPermission", {
        message: error?.message || error,
      });
    }
  }, []);

  useEffect(() => {
    refreshPermission();
  }, [refreshPermission]);

  useFocusEffect(
    useCallback(() => {
      refreshPermission();
    }, [refreshPermission])
  );

  const isEnabled = permissionStatus === "granted";

  const handleToggle = async (value: boolean) => {
    if (toggleLoading) return;

    setToggleLoading(true);
    try {
      if (value) {
        if (Platform.OS === "android") {
          await configureAndroidChannel();
        }

        let { status, canAskAgain: nextCanAskAgain } =
          await Notifications.getPermissionsAsync();

        if (status !== "granted" && nextCanAskAgain) {
          const request = await Notifications.requestPermissionsAsync();
          status = request.status;
          nextCanAskAgain = request.canAskAgain ?? nextCanAskAgain;
        }

        setPermissionStatus(status);
        setCanAskAgain(nextCanAskAgain ?? true);

        if (status === "granted") {
          if (user?.token) {
            await registerForPushNotificationsAsync(user.token);
          }
          AppToast.success("Push notifications enabled.");
        } else if (!nextCanAskAgain) {
          AppToast.info(
            "Notifications are disabled. Enable them in your device settings."
          );
        } else {
          AppToast.info("Notification permission not granted.");
        }
      } else {
        const platformLabel = Platform.OS === "ios" ? "iOS" : "Android";
        AppToast.info(
          `Disable notifications in ${platformLabel} settings to stop alerts.`
        );
        await Linking.openSettings();
      }
    } catch (error: any) {
      AppToast.failed("Unable to update notification settings.");
      Logger.error("PushNotifications", "handleToggle", {
        message: error?.message || error,
      });
    } finally {
      setToggleLoading(false);
    }
  };

  const handleTestPush = async () => {
    if (!isEnabled) {
      AppToast.info("Enable push notifications to send a test alert.");
      return;
    }
    if (!user?.token) {
      AppToast.info("Sign in to send a test alert.");
      return;
    }
    try {
      setSendingTestPush(true);
      const expoToken = await registerForPushNotificationsAsync(user.token);
      if (!expoToken) {
        AppToast.failed(
          `Unable to get a push token for this device. ${JSON.stringify(expoToken)}`
        );
        return;
      }

      // AppToast.success(`EXPO TOKEN ${expoToken.data}`);
      // Logger.warn("EXPO TOKEN", expoToken.data);
      await NotificationService.sendTestPush({
        title: "Sporty Galaxy test",
        body: "Push notifications are working.",
        token: expoToken,
        data: { tapAction: "open-notifications" },
      });
      AppToast.success("Test push triggered.");
    } catch (error: any) {
      const message =
        error?.response?.data?.error || error?.message || "Unable to send push";
      AppToast.failed(message);
    } finally {
      setSendingTestPush(false);
    }
  };

  const statusText =
    permissionStatus === "granted"
      ? "Enabled"
      : permissionStatus === "denied"
        ? "Disabled"
        : "Not set";

  return (
    <ScrollableForm>
      <BodyText size="md" tone={theme.bodyTone} className="mb-4">
        Manage push notifications for order updates and account activity. You
        can turn them on or off per device.
      </BodyText>

      <View
        className={`p-4 rounded-2xl border shadow-sm ${theme.surface} ${theme.primaryBorderColor}`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <BodyText weight="semibold" tone={theme.headingTone}>
              Push notifications
            </BodyText>
            <BodyText size="sm" tone={theme.labelTone} className="mt-1">
              Status: {statusText}
            </BodyText>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={handleToggle}
            disabled={toggleLoading}
            thumbColor={isEnabled ? "#111827" : "#f3f4f6"}
            trackColor={{
              false: isDark ? "#1f2937" : "#E5E7EB",
              true: isDark ? "#374151" : "#cbd5e1",
            }}
          />
        </View>

        {!isEnabled && !canAskAgain && (
          <BodyText size="xs" tone={theme.labelTone} className="mt-3">
            Notifications are disabled in system settings. Tap the toggle to
            open your device settings.
          </BodyText>
        )}
      </View>

      <View
        className={`p-4 mt-4 rounded-2xl border shadow-sm ${theme.surface} ${theme.primaryBorderColor}`}
      >
        <View className="flex-row items-center gap-3 mb-3">
          <Ionicons
            name="notifications-outline"
            size={18}
            color={theme.iconMuted}
          />
          <BodyText weight="medium" tone={theme.headingTone}>
            Send a test push
          </BodyText>
        </View>
        <BodyText size="sm" tone={theme.labelTone} className="mb-4">
          Make sure push notifications are working on this signed-in device.
        </BodyText>
        <PrimaryButton
          title="Send test push"
          onPress={handleTestPush}
          loading={sendingTestPush}
          loadingText="Sending..."
          className={`${theme.primaryButtonClass} w-full`}
          textClassName={theme.primaryTextClassInverse}
          spinnerColor={theme.primarySpinnerColor}
        />
      </View>
    </ScrollableForm>
  );
};

export default PushNotifications;

// {
//       token: "ExponentPushToken[kM-hFgJyGUE_QzNoYpKp_D]",
//       platform: "ios",
//       appVersion: "1.0.1",
//     }
