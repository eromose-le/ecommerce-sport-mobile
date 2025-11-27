import { useColorScheme } from "nativewind";
import React, { createContext, useContext, useMemo } from "react";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (mode: ThemeMode) => void;
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
  placeholderColor: string;
  iconMuted: string;
  successIcon: string;
  primaryButtonClass: string;
  primaryTextClass: string;
  primarySpinnerColor: string;
  secondaryButtonClass: string;
  secondaryTextClass: string;
  secondarySpinnerColor: string;
  linkTextClass: string;
  linkSpinnerColor: string;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STYLES: Record<ThemeMode, ThemeStyles> = {
  light: {
    pageBg: "bg-background",
    surface: "bg-white border-[#0000001A]",
    mutedSurface: "bg-light-100 border border-[#0000001A]",
    headingTone: "primary",
    bodyTone: "primary",
    labelTone: "primary",
    inputClassName: "",
    placeholderColor: "#9CA3AF",
    iconMuted: "#6B7280",
    successIcon: "#10B981",
    primaryButtonClass: "",
    primaryTextClass: "",
    primarySpinnerColor: "#fff",
    secondaryButtonClass: "",
    secondaryTextClass: "",
    secondarySpinnerColor: "#000",
    linkTextClass: "",
    linkSpinnerColor: "#000",
  },
  dark: {
    pageBg: "bg-[#0b0b0f]",
    surface: "bg-[#0f172a] border-[#1f2937]",
    mutedSurface: "bg-[#111827] border border-[#1f2937]",
    headingTone: "inverse",
    bodyTone: "inverse",
    labelTone: "inverse",
    inputClassName: "bg-[#0f172a] border-[#1f2937] text-white",
    placeholderColor: "#9CA3AF",
    iconMuted: "#cbd5e1",
    successIcon: "#34d399",
    primaryButtonClass: "border border-white/10",
    primaryTextClass: "",
    primarySpinnerColor: "#fff",
    secondaryButtonClass: "border-white/70",
    secondaryTextClass: "text-white",
    secondarySpinnerColor: "#f3f4f6",
    linkTextClass: "text-white",
    linkSpinnerColor: "#f3f4f6",
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const theme: ThemeMode = colorScheme === "dark" ? "dark" : "light";

  const value = useMemo<ThemeContextValue>(
    (): ThemeContextValue => ({
      theme,
      isDark: theme === "dark",
      setTheme: (mode: ThemeMode): void => setColorScheme(mode),
      toggleTheme: (): void =>
        setColorScheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme, setColorScheme]
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

export const useThemedStyles = () => {
  const { theme } = useTheme();
  return THEME_STYLES[theme];
};
