type EnvironmentName = "local" | "staging" | "production";

type EnvironmentConfig = {
  apiUrl: string;
  appVersion: string;
  paystackPublicKey: string;
};

const defaultApiUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8800/api/v1";
const defaultAppVersion = process.env.EXPO_PUBLIC_APP_VERSION ?? "1.0.0";

const ENVIRONMENTS: Record<EnvironmentName, EnvironmentConfig> = {
  local: {
    apiUrl: process.env.EXPO_PUBLIC_LOCAL_API_URL ?? defaultApiUrl,
    appVersion: defaultAppVersion,
    paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  },
  staging: {
    apiUrl: process.env.EXPO_PUBLIC_STAGING_API_URL ?? defaultApiUrl,
    appVersion: defaultAppVersion,
    paystackPublicKey: process.env.EXPO_PUBLIC_STAGING_PAYSTACK_PUBLIC_KEY!,
  },
  production: {
    apiUrl: process.env.EXPO_PUBLIC_PROD_API_URL ?? defaultApiUrl,
    appVersion: defaultAppVersion,
    paystackPublicKey: process.env.EXPO_PUBLIC_PROD_PAYSTACK_PUBLIC_KEY!,
  },
};

const parseEnvName = (value?: string | null): EnvironmentName | undefined => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["prod", "production"].includes(normalized)) return "production";
  if (["stage", "staging"].includes(normalized)) return "staging";
  if (["local", "dev", "development"].includes(normalized)) return "local";
  return undefined;
};

const resolvedEnv: EnvironmentName =
  parseEnvName(process.env.EXPO_PUBLIC_APP_ENV) ??
  parseEnvName(process.env.EXPO_PUBLIC_NODE_ENV) ??
  "local";

export const AppEnv = {
  name: resolvedEnv,
  config: ENVIRONMENTS[resolvedEnv],
  isLocal: resolvedEnv === "local",
  isStaging: resolvedEnv === "staging",
  isProduction: resolvedEnv === "production",
} as const;

export type { EnvironmentConfig, EnvironmentName };
