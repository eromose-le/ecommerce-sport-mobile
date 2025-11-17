import { api } from "@/services/api/api";
import {
  ICreateUserPayload,
  ICreateUserResponse,
  ILoginUserPayload,
  ILoginUserResponse,
  IResendSignupOtpPayload,
  IResendSignupOtpResponse,
  IRequestPasswordResetPayload,
  IRequestPasswordResetResponse,
  IVerifySignupOtpPayload,
  IVerifySignupOtpResponse,
  IVerifyPasswordResetPayload,
  IVerifyPasswordResetResponse,
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

export const verifySignupOtp = async (
  payload: IVerifySignupOtpPayload
): Promise<IVerifySignupOtpResponse> => {
  try {
    const res = await api.post("/auth/verify-signup-otp", payload);

    if (!res.data?.success)
      throw new Error(res.data?.error || "OTP verification failed");

    return res.data;
  } catch (error) {
    Logger.error("verifySignupOtp Error", error);
    throw error;
  }
};

export const resendSignupOtp = async (
  payload: IResendSignupOtpPayload
): Promise<IResendSignupOtpResponse> => {
  try {
    const res = await api.post("/auth/send-signup-otp", payload);

    if (!res.data?.success)
      throw new Error(res.data?.error || "Unable to resend OTP");

    return res.data;
  } catch (error) {
    Logger.error("resendSignupOtp Error", error);
    throw error;
  }
};

export const logoutUser = async () => {
  return api.post("/auth/logout");
};

export const requestPasswordReset = async (
  payload: IRequestPasswordResetPayload
): Promise<IRequestPasswordResetResponse> => {
  try {
    const res = await api.post("/auth/send-reset-password-code", payload);

    if (!res.data?.success)
      throw new Error(res.data?.error || "Unable to send reset code");

    return res.data;
  } catch (error) {
    Logger.error("requestPasswordReset Error", error);
    throw error;
  }
};

export const verifyPasswordResetCode = async (
  payload: IVerifyPasswordResetPayload
): Promise<IVerifyPasswordResetResponse> => {
  try {
    const res = await api.post(
      "/auth/validate-reset-password-code",
      payload
    );

    if (!res.data?.success)
      throw new Error(res.data?.error || "Password reset failed");

    return res.data;
  } catch (error) {
    Logger.error("verifyPasswordResetCode Error", error);
    throw error;
  }
};
