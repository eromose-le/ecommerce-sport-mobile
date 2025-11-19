import { PaginatedServerResponse } from "@/types/global";

export type OrderProduct = {
  id: string | number;
  name: string;
  displayImage?: string;
};

export type OrderItem = {
  orderId: string;
  productId?: string | number;
  product?: OrderProduct;
  quantity?: number;
  reviewed?: boolean;
  productCompleted?: boolean;
};

export type Order = {
  id: string | number;
  status: string;
  createdAt: string;
  items?: OrderItem[];
};

export interface FetchOrdersParams {
  userId?: string | number;
  sort?: string;
  page?: number;
  limit?: number;
}

export type OrdersResponse = PaginatedServerResponse<Order>;
