import { api } from "@/services/api/api";
import {
  ICreateUserPayload,
  ICreateUserResponse,
  ILoginUserPayload,
  ILoginUserResponse,
} from "@/services/auth/auth.types";
import { Logger } from "@/utils/logger";

export const loginUser = async (
  payload: ILoginUserPayload
): Promise<ILoginUserResponse> => {
  try {
    const res = await api.post("/auth/login", payload);

    if (!res.data?.success) throw new Error(res.data?.error || "Login failed");

    return res.data;
  } catch (error) {
    Logger.error("loginUser Error", error);
    throw error;
  }
};

export const logoutUser = async () => {
  return api.post("/auth/logout");
};

export const registerUser = async (
  payload: ICreateUserPayload
): Promise<ICreateUserResponse> => {
  try {
    const res = await api.post("/auth/register", payload);

    if (!res.data?.success)
      throw new Error(res.data?.error || "Registration failed");

    return res.data;
  } catch (error) {
    Logger.error("registerUser Error", error);
    throw error;
  }
};
