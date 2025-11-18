import { api } from "../api/api";
import { Logger } from "@/utils/logger";
import { IUpdateUserParams, IUpdateUserPayload, IUserResponse } from "./user.types";

export const fetchMe = async (): Promise<IUserResponse> => {
  try {
    const response = await api.get("/users/me");

    if (response?.data?.success) {
      if (!response?.data?.data?.isVerified) {
        throw new Error(response?.data?.error || "Verify your Account");
      }
      return response.data;
    } else {
      throw new Error(response?.data?.error || "Failed to fetch user");
    }
  } catch (error) {
    Logger.error("fetchMe Error", error);
    throw error;
  }
};

export const updateUser = async (
  payload: IUpdateUserPayload,
  params: IUpdateUserParams
): Promise<IUserResponse> => {
  if (!params?.id) throw new Error("Missing user id");

  try {
    const response = await api.put(`/users/${params.id}`, payload);

    if (response?.data?.success) {
      return response.data;
    }

    throw new Error(response?.data?.error || "Failed to update profile");
  } catch (error) {
    Logger.error("updateUser Error", error);
    throw error;
  }
};
