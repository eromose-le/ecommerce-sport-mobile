import { AppEnv } from "@/constants/env";
import { Logger } from "@/utils/logger";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: AppEnv.config.apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token before request
api.interceptors.request.use(async (config) => {
  const tokenString = await SecureStore.getItemAsync("user");
  const token = tokenString ? JSON.parse(tokenString) : null;

  Logger.warn("TOKEN", token?.token);
  Logger.warn("HEADERS", config.headers);
  if (token) {
    config.headers.Authorization = `Bearer ${token?.token}`;
  }
  return config;
});

// Handle unauthorized
api.interceptors.response.use(
  (res) => {
    Logger.success("AXIOS RESPONSE:", res?.data);
    return res;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
    }

    Logger.error("AXIOS ERROR:", error?.message);
    return Promise.reject(error);
  }
);
