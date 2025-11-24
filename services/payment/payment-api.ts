import { api } from "../api/api";
import { Logger } from "@/utils/logger";
import { AxiosRequestConfig } from "axios";

export type InitializePaymentPayload = {
  userId?: string | number;
  amount: number;
  currency: string;
  email: string;
  metadata?: any;
  gatewayName?: string;
  paymentOption?: "FULL" | "PARTIAL";
} & Record<string, any>;

export type InitializePaymentResponse = {
  success?: boolean;
  message?: string;
  data?: {
    authorizationUrl?: string;
    authorization_url?: string;
    reference?: string;
    [key: string]: any;
  };
};

export type FinalizePaymentPayload = {
  reference: string;
  backendReference?: string;
  transactionLog?: any;
  metadata?: any;
};

export type FinalizePaymentResponse = {
  success?: boolean;
  message?: string;
  data?: any;
};

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
