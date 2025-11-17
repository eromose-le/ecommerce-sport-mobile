import { api } from "../api/api";
import { Logger } from "@/utils/logger";
import { IUserResponse } from "./user.types";

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
