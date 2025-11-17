import { api } from "../api/api";
import { AxiosRequestConfig } from "axios";
import { Logger } from "@/utils/logger";
import { axiosBaseQuery } from "../api/base-query";
import { TProductQuery } from "./product.types";

export const fetchProducts = async (
  params?: TProductQuery,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await api.get(
      "/products",
      axiosBaseQuery({
        ...config,
        params: {
          isDeleted: false,
          ...params,
        },
      })
    );
    return response.data;
  } catch (error) {
    Logger.error("fetchProducts Error", error);
    throw error;
  }
};

export const fetchProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
