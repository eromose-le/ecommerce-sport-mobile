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
