import { api } from "@/services/api/api";
import { Logger } from "@/utils/logger";
import { FetchOrdersParams, OrdersResponse } from "./order.types";

export const fetchOrders = async (
  params: FetchOrdersParams
): Promise<OrdersResponse> => {
  try {
    const response = await api.get("/orders", {
      params,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.error || "Unable to fetch orders");
    }

    return response.data;
  } catch (error) {
    Logger.error("fetchOrders Error", error);
    throw error;
  }
};
