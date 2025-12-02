import { Logger } from "@/utils/logger";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export type AppLockSettings = {
  biometricsEnabled: boolean;
  passcodeEnabled: boolean;
  passcode: string | null;
};

type DeviceAuthInfo = {
  supported: boolean;
  enrolled: boolean;
  types: LocalAuthentication.AuthenticationType[];
};

type AppLockState = {
  hydrated: boolean;
  locked: boolean;
  settings: AppLockSettings;
  device: DeviceAuthInfo;
  setHydrated: (value: boolean) => void;
  setLocked: (value: boolean) => void;
  refreshDeviceInfo: () => Promise<DeviceAuthInfo>;
  enableBiometrics: () => void;
  disableBiometrics: () => void;
  setPasscode: (passcode: string) => void;
  disablePasscode: () => void;
  clear: () => void;
};

const secureStoreStorage: StateStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

const defaultSettings: AppLockSettings = {
  biometricsEnabled: false,
  passcodeEnabled: false,
  passcode: null,
};

const defaultDeviceInfo: DeviceAuthInfo = {
  supported: false,
  enrolled: false,
  types: [],
};

export const useAppLockStore = create<AppLockState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      locked: false,
      settings: defaultSettings,
      device: defaultDeviceInfo,
      setHydrated: (value) => set({ hydrated: value }),
      setLocked: (value) => set({ locked: value }),
      refreshDeviceInfo: async () => {
        try {
          const supported = await LocalAuthentication.hasHardwareAsync();
          const enrolled = supported
            ? await LocalAuthentication.isEnrolledAsync()
            : false;
          const types = supported
            ? await LocalAuthentication.supportedAuthenticationTypesAsync()
            : [];

          const device = { supported, enrolled, types };
          set({ device });
          return device;
        } catch (error) {
          set({ device: defaultDeviceInfo });
          Logger.warn(
            "AppLockStore",
            "Failed to refresh device auth info",
            error
          );
          return defaultDeviceInfo;
        }
      },
      enableBiometrics: () =>
        set((state) => ({
          settings: { ...state.settings, biometricsEnabled: true },
        })),
      disableBiometrics: () =>
        set((state) => ({
          settings: { ...state.settings, biometricsEnabled: false },
        })),
      setPasscode: (passcode: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            passcode: passcode.trim(),
            passcodeEnabled: true,
          },
        })),
      disablePasscode: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            passcode: null,
            passcodeEnabled: false,
          },
        })),
      clear: () => {
        set({
          locked: false,
          settings: defaultSettings,
          device: defaultDeviceInfo,
        });
      },
    }),
    {
      name: "app-lock-settings",
      storage: createJSONStorage(() => secureStoreStorage),
      partialize: (state) => ({ settings: state.settings }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
