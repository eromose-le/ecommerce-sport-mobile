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

type IPaystackLog = {
  start_time: number;
  time_spent: number;
  attempts: number;
  errors: number;
  success: boolean;
  mobile: boolean;
  input?: unknown;
  authentication?: string;
  channel?: unknown;
  history: {
    type: string;
    message: string;
    time: number;
  }[];
};

type IPaystackAuthorization = {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel?: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable?: boolean;
  signature?: string;
  account_name?: string;
};

type IPaystackCustomer = {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  customer_code: string;
  phone?: string;
  metadata?: unknown;
  risk_action: string;
  international_format_phone?: unknown;
};

export type PaystackVerifyTransactionRes = {
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata?: string;
    log: IPaystackLog;
    fees: number;
    fees_split?: unknown;
    authorization: IPaystackAuthorization;
    customer: IPaystackCustomer;
    plan?: string;
    split?: unknown;
    order_id?: string;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data?: unknown;
    source?: unknown;
    fees_breakdown?: unknown;
    transaction_date: string;
    plan_object?: unknown;
    subaccount?: unknown;
  };
  message: string;
  status: boolean;
};

export interface PaystackTransaction {
  reference: string;
  status: string;
  transaction: string;
  // Add any other fields you need
  trans?: string;
  message?: string;
  trxref?: string;
  redirecturl?: string;
}

export interface InitializePayment {
  reference: string;
  backendReference: string;
  transactionLog: PaystackTransaction;
  metadata: any;
}
