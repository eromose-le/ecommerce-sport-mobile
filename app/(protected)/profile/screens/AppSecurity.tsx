import AppLoader from "@/components/common/AppLoader";
import PasswordField from "@/components/common/PasswordField";
import ScrollableForm from "@/components/common/ScrollableForm";
import { BodyText, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useAppLock } from "@/hooks/useAppLock";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { AppToast } from "@/utils/toast";
import { ScreenComponentProps } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Switch, View } from "react-native";

const AppSecurity: React.FC<ScreenComponentProps> = () => {
  const {
    settings,
    device,
    biometricsAvailable,
    biometricLabel,
    enableBiometricLock,
    disableBiometrics,
    savePasscode,
    disablePasscode,
    disableAllSecurity,
    lockEnabled,
    refreshDeviceInfo,
    hydrated,
  } = useAppLock();
  const theme = useThemedStyles();
  const { isDark } = useTheme();

  const [biometricLoading, setBiometricLoading] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  useEffect(() => {
    refreshDeviceInfo();
  }, [refreshDeviceInfo]);

  const biometricStatus = useMemo(() => {
    if (!device.supported) return "Biometrics not supported on this device";
    if (!device.enrolled) return "Set up biometrics in your device settings";
    return `${biometricLabel} ready`;
  }, [biometricLabel, device.enrolled, device.supported]);

  const handleToggleBiometrics = async (value: boolean) => {
    setBiometricLoading(true);
    if (value) {
      await enableBiometricLock();
    } else {
      disableBiometrics();
      AppToast.info("Biometric unlock disabled");
    }
    setBiometricLoading(false);
  };

  const validatePasscode = () => {
    const trimmed = passcode.trim();
    const confirm = confirmPasscode.trim();

    if (trimmed.length < 4) {
      return "Passcode must be at least 4 characters";
    }

    if (trimmed.length > 12) {
      return "Passcode should be under 12 characters";
    }

    if (trimmed !== confirm) {
      return "Passcodes do not match";
    }

    return "";
  };

  const handleSavePasscode = () => {
    const error = validatePasscode();
    if (error) {
      setPasscodeError(error);
      return;
    }

    savePasscode(passcode.trim());
    setPasscode("");
    setConfirmPasscode("");
    setPasscodeError(null);
  };

  const handleDisablePasscode = () => {
    disablePasscode();
    setPasscode("");
    setConfirmPasscode("");
    setPasscodeError(null);
    AppToast.info("Passcode removed");
  };

  if (!hydrated) {
    return (
      <View className="items-center justify-center flex-1">
        <AppLoader />
      </View>
    );
  }

  return (
    <ScrollableForm>
      <BodyText size="md" tone={theme.bodyTone} className="mb-4">
        Protect the app with biometrics or a local passcode. You will be asked
        to unlock Sporty Galaxy whenever you reopen it.
      </BodyText>

      <View
        className={`p-4 rounded-2xl border shadow-sm ${theme.surface} ${theme.primaryBorderColor}`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <BodyText weight="semibold" tone={theme.headingTone}>
              Biometric unlock
            </BodyText>
            <BodyText size="sm" tone={theme.labelTone} className="mt-1">
              Use {biometricLabel} instead of typing a passcode.
            </BodyText>
          </View>
          <Switch
            value={settings.biometricsEnabled}
            onValueChange={handleToggleBiometrics}
            disabled={biometricLoading}
            thumbColor={settings.biometricsEnabled ? "#111827" : "#f3f4f6"}
            trackColor={{
              false: isDark ? "#1f2937" : "#E5E7EB",
              true: isDark ? "#374151" : "#cbd5e1",
            }}
          />
        </View>

        <View className="flex-row items-center gap-2 mt-3">
          <Ionicons
            name={biometricsAvailable ? "shield-checkmark" : "shield-outline"}
            size={18}
            color={biometricsAvailable ? theme.successIcon : theme.iconMuted}
          />
          <BodyText
            size="sm"
            tone={biometricsAvailable ? "success" : theme.labelTone}
            className="flex-1"
          >
            {biometricStatus}
          </BodyText>
        </View>

        {settings.biometricsEnabled && !device.enrolled && (
          <BodyText size="xs" tone="danger" className="mt-2">
            A fingerprint or Face ID must be enrolled on this device to use
            biometric unlock.
          </BodyText>
        )}
      </View>

      <View
        className={`p-4 rounded-2xl border shadow-sm mt-4 ${theme.surface} ${theme.primaryBorderColor}`}
      >
        <BodyText weight="semibold" tone={theme.headingTone}>
          App passcode
        </BodyText>
        <BodyText size="sm" tone={theme.labelTone} className="mt-1">
          Create a local passcode to unlock the app when biometrics are not
          available.
        </BodyText>

        <View className="gap-3 mt-4">
          <PasswordField
            label="Passcode"
            placeholder="Enter passcode"
            keyboardType="number-pad"
            value={passcode}
            onChangeText={(text) => {
              setPasscode(text);
              setPasscodeError(null);
            }}
            maxLength={12}
          />
          <PasswordField
            label="Confirm passcode"
            placeholder="Re-enter passcode"
            keyboardType="number-pad"
            value={confirmPasscode}
            onChangeText={(text) => {
              setConfirmPasscode(text);
              setPasscodeError(null);
            }}
            maxLength={12}
          />

          {passcodeError && (
            <BodyText size="sm" tone="danger">
              {passcodeError}
            </BodyText>
          )}

          <PrimaryButton
            title={settings.passcodeEnabled ? "Update passcode" : "Save passcode"}
            onPress={handleSavePasscode}
            disabled={!passcode || !confirmPasscode}
            className={theme.primaryButtonClass}
            textClassName={theme.primaryTextClassInverse}
            spinnerColor={theme.primarySpinnerColor}
          />

          {settings.passcodeEnabled && (
            <SecondaryButton
              title="Disable passcode"
              onPress={handleDisablePasscode}
              className={theme.secondaryButtonClass}
              textClassName={theme.secondaryTextClass}
              spinnerColor={theme.secondarySpinnerColor}
            />
          )}
        </View>
      </View>

      <View
        className={`flex-row items-center gap-3 p-4 mt-4 rounded-2xl border ${theme.surface} ${theme.primaryBorderColor}`}
      >
        <Ionicons
          name={lockEnabled ? "lock-closed" : "lock-open"}
          size={22}
          color={lockEnabled ? theme.successIcon : theme.iconMuted}
        />
        <View className="flex-1">
          <BodyText weight="semibold" tone={theme.headingTone}>
            {lockEnabled ? "App lock enabled" : "App lock disabled"}
          </BodyText>
          <BodyText size="sm" tone={theme.labelTone} className="mt-1">
            {lockEnabled
              ? "You will be asked to unlock after reopening or returning to the app."
              : "Turn on biometrics or set a passcode to require an unlock locally."}
          </BodyText>
        </View>

        {lockEnabled && (
          <SecondaryButton
            title="Turn off"
            onPress={() => {
              disableAllSecurity();
              AppToast.info("App lock disabled");
            }}
            className="w-28"
            textClassName={theme.secondaryTextClass}
            spinnerColor={theme.secondarySpinnerColor}
          />
        )}
      </View>
    </ScrollableForm>
  );
};

export default AppSecurity;
