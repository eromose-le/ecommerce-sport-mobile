import { useAuth } from "@/providers/auth";
import { useAppLockStore } from "@/store/useAppLockStore";
import { Logger } from "@/utils/logger";
import { AppToast } from "@/utils/toast";
import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useMemo } from "react";
import { AppState, Platform } from "react-native";

export const getBiometricLabel = (
  types: LocalAuthentication.AuthenticationType[]
) => {
  const has = (type: LocalAuthentication.AuthenticationType) =>
    types.includes(type);

  if (has(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return Platform.OS === "ios" ? "Face ID" : "Face unlock";
  }

  if (has(LocalAuthentication.AuthenticationType.IRIS)) {
    return "Iris";
  }

  if (has(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
  }

  return Platform.OS === "ios" ? "Face ID" : "Biometric unlock";
};

export const useAppLock = (attachLifecycle = false) => {
  const { user } = useAuth();
  const settings = useAppLockStore((state) => state.settings);
  const device = useAppLockStore((state) => state.device);
  const locked = useAppLockStore((state) => state.locked);
  const hydrated = useAppLockStore((state) => state.hydrated);
  const setLocked = useAppLockStore((state) => state.setLocked);
  const refreshDeviceInfo = useAppLockStore((state) => state.refreshDeviceInfo);
  const enableBiometrics = useAppLockStore((state) => state.enableBiometrics);
  const disableBiometrics = useAppLockStore((state) => state.disableBiometrics);
  const setPasscode = useAppLockStore((state) => state.setPasscode);
  const disablePasscode = useAppLockStore((state) => state.disablePasscode);
  const clear = useAppLockStore((state) => state.clear);

  const biometricsAvailable = useMemo(
    () =>
      settings.biometricsEnabled &&
      device.supported &&
      device.enrolled &&
      device.types.length > 0,
    [
      settings.biometricsEnabled,
      device.supported,
      device.enrolled,
      device.types.length,
    ]
  );

  const hasPasscode = useMemo(
    () => settings.passcodeEnabled && !!settings.passcode,
    [settings.passcode, settings.passcodeEnabled]
  );

  const lockEnabled = biometricsAvailable || hasPasscode;

  const biometricLabel = useMemo(
    () => getBiometricLabel(device.types),
    [device.types]
  );

  useEffect(() => {
    refreshDeviceInfo();
  }, [refreshDeviceInfo]);

  useEffect(() => {
    if (!attachLifecycle || !hydrated) return;

    if (!user || !lockEnabled) {
      setLocked(false);
      return;
    }

    setLocked(true);
  }, [attachLifecycle, hydrated, lockEnabled, setLocked, user]);

  useEffect(() => {
    if (!attachLifecycle) return;

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && user && lockEnabled) {
        setLocked(true);
      }
    });

    return () => sub.remove();
  }, [attachLifecycle, lockEnabled, setLocked, user]);

  const performBiometricCheck = useCallback(async (promptMessage: string) => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: "Cancel",
        fallbackLabel: "Use device passcode",
        disableDeviceFallback: false,
        requireConfirmation: true,
      });

      return result.success;
    } catch (error) {
      Logger.error("Biometric auth failed", error);
      return false;
    }
  }, []);

  const unlockWithBiometrics = useCallback(async () => {
    if (!biometricsAvailable) {
      AppToast.failed(`${biometricLabel} not available on this device`);
      return false;
    }

    const success = await performBiometricCheck(
      `Unlock Sporty Galaxy with ${biometricLabel}`
    );
    if (success) setLocked(false);

    return success;
  }, [biometricLabel, biometricsAvailable, performBiometricCheck, setLocked]);

  const unlockWithPasscode = useCallback(
    (input: string) => {
      if (!settings.passcodeEnabled || !settings.passcode) {
        AppToast.failed("Passcode unlock is not enabled");
        return false;
      }

      if (settings.passcode === input.trim()) {
        setLocked(false);
        return true;
      }

      return false;
    },
    [setLocked, settings.passcode, settings.passcodeEnabled]
  );

  const enableBiometricLock = useCallback(async () => {
    const info = await refreshDeviceInfo();
    if (!info.supported) {
      AppToast.failed("This device does not support biometrics");
      return false;
    }

    if (!info.enrolled) {
      AppToast.info(`Set up ${biometricLabel} in your device settings`);
      return false;
    }

    const success = await performBiometricCheck(
      `Confirm ${biometricLabel} to enable app lock`
    );
    if (success) {
      enableBiometrics();
      AppToast.success(`${biometricLabel} unlock enabled`);
    }

    return success;
  }, [
    biometricLabel,
    enableBiometrics,
    performBiometricCheck,
    refreshDeviceInfo,
  ]);

  const savePasscode = useCallback(
    (passcode: string) => {
      setPasscode(passcode);
      AppToast.success("App passcode saved");
    },
    [setPasscode]
  );

  const disableAllSecurity = useCallback(() => {
    disableBiometrics();
    disablePasscode();
    setLocked(false);
  }, [disableBiometrics, disablePasscode, setLocked]);

  return {
    hydrated,
    locked,
    settings,
    device,
    lockEnabled,
    hasPasscode,
    biometricsAvailable,
    biometricLabel,
    unlockWithBiometrics,
    unlockWithPasscode,
    enableBiometricLock,
    disableBiometrics,
    disablePasscode,
    savePasscode,
    disableAllSecurity,
    refreshDeviceInfo,
    setLocked,
    clear,
  };
};
