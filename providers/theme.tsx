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
    inputClassNameInverse: "bg-[#0f172a] border-[#1f2937] text-white",
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

export const useThemedStyles = (mood?: "light" | "dark") => {
  const { theme } = useTheme();
  return THEME_STYLES[mood ?? theme];
};
