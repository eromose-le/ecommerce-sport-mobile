import { PaginatedServerResponse } from "@/types/global";

export interface Product {
  id: string;

  images: string[];
  variations: string[];
  attributes: ProductAttribute[];
  reviews: ProductReview[];

  //
  name: string;
  description: string;
  price: number;
  displayImage: any;

  salesPrice?: number;
  stock?: number;
  categoryId?: string;
  subcategoryId?: string;
  specification?: ProductSpecification[];
  keyattribute?: ProductSpecification[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  sizes?: any[];
  colors?: any[];
  medias?: ProductMedia[];
}

export interface ProductAttribute {
  title: string;
  text: string;
}

export interface ProductReview {
  id: number;
  username: string;
  avatar: string;
  date: string; // e.g. "Oct 8, 2024"
  rating: number; // 1–5 stars
  comment: string;
}

export type TProduct = {
  id: number;
  name: string;
  description: string;
  price: string;
  salesPrice?: string;
  displayImage: string | null;
};

export type TProductQuery = {
  instance?: any; // optional for reactQuery
  limit?: any;
  page?: any;
  q?: string;
  category?: string;
  subcategory?: string;
  stock?: string;
  color?: string[];
  type?: string[];
  size?: string[];
  minPrice?: string;
  maxPrice?: string;
  price?: {
    isCustom: boolean;
    range: [number, number];
  };
  sort?: undefined | "asc" | "desc";

  createdAt?: string | null | undefined;
  updatedAt?: Date | null;
  filter?: {
    instance?: any; // optional for reactQuery
    limit?: any;
    page?: any;
    category?: string;
    subcategory?: string;
    stock?: string;
    color?: string[];
    type?: string[];
    size?: string[];
    minPrice?: string;
    maxPrice?: string;
    price?: {
      isCustom?: boolean;
      range?: [number, number];
    };
    sort?: undefined | "asc" | "desc";
    createdAt?: string | null | undefined;
    updatedAt?: Date | null;
  };
};

export interface ProductMedia {
  images?: string[];
  type: "image" | "video";
  displayImage: string;
  links?: {
    introVideo?: string;
    completeVideo?: string;
  };
}

export interface ProductSpecification {
  Key: string;
}

export type IProductResponse = PaginatedServerResponse<Product>;
