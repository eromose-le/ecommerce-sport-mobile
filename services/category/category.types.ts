import { ServerResponse } from "@/types/global";

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

export type CategoriesResponse = ServerResponse<Category[]>;
export type CategoryResponse = ServerResponse<Category>;
