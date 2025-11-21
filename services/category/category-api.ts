import { api } from "@/services/api/api";
import { Logger } from "@/utils/logger";
import {
  CategoriesResponse,
  CategoryResponse,
} from "./category.types";

export const fetchCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await api.get("/products/category", {
      params: { isDeleted: false },
    });

    if (response?.data?.success) {
      return response.data;
    }
    throw new Error(response?.data?.error || "Unable to fetch categories");
  } catch (error) {
    Logger.error("fetchCategories Error", error);
    throw error;
  }
};

export const fetchCategoryById = async (
  id: string
): Promise<CategoryResponse> => {
  try {
    const response = await api.get(`/products/category/${id}`);
    if (response?.data?.success) {
      return response.data;
    }
    throw new Error(response?.data?.error || "Unable to fetch category");
  } catch (error) {
    Logger.error("fetchCategoryById Error", error);
    throw error;
  }
};
