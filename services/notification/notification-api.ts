import { api } from "@/services/api/api";
import { Logger } from "@/utils/logger";

export type RegisterPushTokenPayload = {
  token: string;
  platform: string;
  appVersion?: string;
  authToken?: string;
};

export const registerPushToken = async ({
  token,
  platform,
  appVersion,
  authToken,
}: RegisterPushTokenPayload) => {
  try {
    await api.post(
      "/push/register-token",
      { token, platform, appVersion },
      authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : undefined
    );
  } catch (error) {
    Logger.error("registerPushToken Error", error);
    throw error;
  }
};

export const sendTestPush = async () => {
  try {
    return await api.post("/push/test");
  } catch (error) {
    Logger.error("sendTestPush Error", error);
    throw error;
  }
};
