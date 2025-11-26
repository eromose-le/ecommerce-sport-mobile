import { AppEnv } from "@/constants/env";
import React from "react";
import {
  PaystackProvider as PaystackGatewayProvider,
  PaystackProps,
} from "react-native-paystack-webview";

export const paystackConfig: PaystackProps.PaystackProviderProps = {
  debug: true,
  publicKey: AppEnv.config.paystackPublicKey,
  currency: "NGN",
  defaultChannels: ["card", "mobile_money", "bank_transfer", "ussd", "qr"],
  children: null,
};

export type PaystackConfig = PaystackProps.PaystackProviderProps;

export const PaystackProvider = ({
  children,
  config = paystackConfig,
}: {
  children: React.ReactNode;
  config?: PaystackConfig;
}) => {
  return (
    <PaystackGatewayProvider {...config}>{children}</PaystackGatewayProvider>
  );
};
