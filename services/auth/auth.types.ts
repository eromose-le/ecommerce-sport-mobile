import { ServerResponse } from "../../types/global";
import { User } from "../user/user.types";

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export type ILoginUserResponse = ServerResponse<User>;

export interface ICreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export type ICreateUserResponse = ServerResponse<User>;

export interface IVerifySignupOtpPayload {
  code: string;
  email: string;
}

export type IVerifySignupOtpResponse = ServerResponse<User>;

export interface IResendSignupOtpPayload {
  email: string;
}

export type IResendSignupOtpResponse = ServerResponse<null>;

export interface IRequestPasswordResetPayload {
  email: string;
}

export type IRequestPasswordResetResponse = ServerResponse<{ email: string }>;

export interface IVerifyPasswordResetPayload {
  email: string;
  code: string;
  newPassword: string;
}

export type IVerifyPasswordResetResponse = ServerResponse<{ email: string }>;
