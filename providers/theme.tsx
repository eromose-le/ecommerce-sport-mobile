import { Logger } from "@/utils/logger";
import * as SecureStore from "expo-secure-store";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";

type ThemeMode = "light" | "dark";
export type ThemePreference = ThemeMode | "system";

type ThemeContextValue = {
  theme: ThemeMode;
  preference: ThemePreference;
  isDark: boolean;
  setTheme: (mode: ThemePreference) => void;
  toggleTheme: () => void;
};

type ThemeStyles = {
  pageBg: string;
  surface: string;
  mutedSurface: string;
  headingTone: "primary" | "inverse";
  bodyTone: "primary" | "secondary" | "muted" | "inverse";
  labelTone: "primary" | "secondary" | "muted" | "inverse";
  inputClassName: string;
  inputClassNameInverse: string;
  placeholderColor: string;
  iconMuted: string;
  successIcon: string;
  primaryButtonClass: string;
  primaryTextClass: string;
  primaryTextClassInverse: string;
  primarySpinnerColor: string;
  secondaryButtonClass: string;
  secondaryTextClass: string;
  secondarySpinnerColor: string;
  linkTextClass: string;
  linkSpinnerColor: string;
  primaryBorderColor: string;
  pageBgInverse: string;
};

const THEME_PREFERENCE_KEY = "theme-preference";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STYLES: Record<ThemeMode, ThemeStyles> = {
  light: {
    pageBg: "bg-background",
    pageBgInverse: "bg-[#0b0b0f]",
    surface: "bg-white border-[#0000001A]",
    mutedSurface: "bg-light-100",
    headingTone: "primary",
    bodyTone: "primary",
    labelTone: "primary",
    inputClassName: "",
    inputClassNameInverse: "",
    placeholderColor: "#aaaaaa",
    iconMuted: "#6B7280",
    successIcon: "#10B981",
    primaryButtonClass: "",
    primaryTextClass: "text-black",
    primaryTextClassInverse: "text-white",
    primarySpinnerColor: "#000",
    secondaryButtonClass: "",
    secondaryTextClass: "text-black",
    secondarySpinnerColor: "#000",
    linkTextClass: "text-black",
    linkSpinnerColor: "#000",
    primaryBorderColor: "border-[#0000001A]",
  },
  dark: {
    pageBg: "bg-black",
    pageBgInverse: "bg-background",
    surface: "bg-[#0f172a] border-[#1f2937]",
    mutedSurface: "bg-[#111827]",
    headingTone: "inverse",
    bodyTone: "inverse",
    labelTone: "secondary",
    inputClassName: "bg-[#0f172a] border-[#1f2937] text-white",
    inputClassNameInverse:
      "bg-[#111827] border-[#1f2937] dark:focus:border-[#808080] text-white",
    placeholderColor: "#aaaaaa",
    iconMuted: "#cbd5e1",
    successIcon: "#34d399",
    primaryButtonClass: "border border-background bg-background",
    primaryTextClass: "text-white",
    primaryTextClassInverse: "text-black",
    primarySpinnerColor: "#fff",
    secondaryButtonClass: "border-background",
    secondaryTextClass: "text-secondary",
    secondarySpinnerColor: "#f3f4f6",
    linkTextClass: "text-white",
    linkSpinnerColor: "#f3f4f6",
    primaryBorderColor: "border-background",
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setColorScheme: setNativewindColorScheme } =
    useNativewindColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("light");
  const [systemScheme, setSystemScheme] = useState<ThemeMode>(() =>
    Appearance.getColorScheme() === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const storageAvailable = await SecureStore.isAvailableAsync();
        if (!storageAvailable) return;

        const storedPreference =
          await SecureStore.getItemAsync(THEME_PREFERENCE_KEY);

        if (
          storedPreference === "light" ||
          storedPreference === "dark" ||
          storedPreference === "system"
        ) {
          setPreference(storedPreference);
        }
      } catch (error) {
        Logger.warn("Theme preference load failed", error);
      }
    };

    loadPreference();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === "dark" ? "dark" : "light");
    });

    return () => subscription.remove();
  }, []);

  const resolvedTheme: ThemeMode =
    preference === "system" ? systemScheme : preference;

  useEffect(() => {
    const targetScheme = preference === "system" ? "system" : resolvedTheme;

    try {
      setNativewindColorScheme(targetScheme);
    } catch (error) {
      Logger.warn("Nativewind theme sync failed", error);
    }

    if (preference === "system") {
      const deviceScheme =
        Appearance.getColorScheme() === "dark" ? "dark" : "light";
      setSystemScheme(deviceScheme);
    }
  }, [preference, resolvedTheme, setNativewindColorScheme]);

  const persistPreference = useCallback(async (mode: ThemePreference) => {
    setPreference(mode);
    try {
      const storageAvailable = await SecureStore.isAvailableAsync();
      if (!storageAvailable) return;

      await SecureStore.setItemAsync(THEME_PREFERENCE_KEY, mode);
    } catch (error) {
      Logger.warn("Theme preference save failed", error);
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    (): ThemeContextValue => ({
      theme: resolvedTheme,
      preference,
      isDark: resolvedTheme === "dark",
      setTheme: (mode: ThemePreference): void => {
        persistPreference(mode);
      },
      toggleTheme: (): void => {
        const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
        persistPreference(nextTheme);
      },
    }),
    [persistPreference, preference, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};

export const useThemedStyles = (mood?: ThemeMode) => {
  const { theme } = useTheme();
  return THEME_STYLES[mood ?? theme];
};
