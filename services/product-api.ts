import { TProductQuery } from "@/types/product";
import { api } from "./api";
import { AxiosRequestConfig } from "axios";
import { Logger } from "@/utils/logger";
import { axiosBaseQuery } from "./base-query";

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
