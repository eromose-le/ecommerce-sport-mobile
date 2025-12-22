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
}: RegisterPushTokenPayload | any) => {
  try {
    return await api.post(
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

export type SendTestPushPayload = Partial<{
  title: string;
  body: string;
  token: string;
  data: Record<string, any>;
}>;

export const sendTestPush = async (payload?: SendTestPushPayload) => {
  try {
    return await api.post("/push/test", {
      title: payload?.title ?? "Test notification",
      body: payload?.body ?? "Push notifications are working.",
      token: payload?.token,
      data: payload?.data ?? { tapAction: "open-notifications" },
    });
  } catch (error) {
    Logger.error("sendTestPush Error", error);
    throw error;
  }
};
