import { Logger } from "@/utils/logger";
import { AxiosRequestConfig } from "axios";
import { api } from "../api/api";
import {
  FinalizePaymentPayload,
  FinalizePaymentResponse,
  InitializePaymentPayload,
  InitializePaymentResponse,
} from "./payment.types";

export const initiatePayment = async (
  payload: InitializePaymentPayload,
  config?: AxiosRequestConfig
): Promise<InitializePaymentResponse> => {
  try {
    const response = await api.post("/payments/process", payload, config);
    return response.data;
  } catch (error) {
    Logger.error("initiatePayment Error", error);
    throw error;
  }
};

export const finalizePayment = async (
  payload: FinalizePaymentPayload,
  config?: AxiosRequestConfig
): Promise<FinalizePaymentResponse> => {
  try {
    const response = await api.post("/payments/finalize", payload, config);
    return response.data;
  } catch (error) {
    Logger.error("finalizePayment Error", error);
    throw error;
  }
};
