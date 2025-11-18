import { AppEnv } from "@/constants/env";

// Toggle this to hide logs in production
const ENABLE_LOGS = !AppEnv.isProduction;

// Color presets for console logs
const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m",
  success: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  label: "\x1b[35m",
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const print = (label: string, color: string, ...msg: any[]) => {
  if (!ENABLE_LOGS) return;

  console.log(
    `${colors.label}[${label}]${colors.reset} ${color}${getTimestamp()} →`,
    // NOTE: trims the respnse remove all white space
    // ...msg,
    `\n${JSON.stringify(msg, null, 2)}`,
    colors.reset
  );
};

export const Logger = {
  info: (label: string, ...msg: any[]) => print(label, colors.info, ...msg),
  success: (label: string, ...msg: any[]) =>
    print(label, colors.success, ...msg),
  warn: (label: string, ...msg: any[]) => print(label, colors.warn, ...msg),
  error: (label: string, ...msg: any[]) => print(label, colors.error, ...msg),

  // Useful for debugging large objects (pretty printed)
  dump: (label: string, obj: any) => {
    if (!ENABLE_LOGS) return;
    console.log(
      `${colors.label}[${label}]${colors.reset} ${colors.info}${getTimestamp()} →`,
      // `\n${JSON.stringify(obj, null, 2)}`,
      obj,
      colors.reset
    );
  },
};
