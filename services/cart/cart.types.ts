import {
  ProductAttribute,
  ProductMedia,
  ProductReview,
  ProductSpecification,
} from "../product/product.types";

export type CartVariant = {
  variantId?: string | number;
  price?: number;
  salesPrice?: number;
  colorsPrice?: number;
  dimensionsPrice?: number;
  sizesPrice?: number;
  weightsPrice?: number;
  qty?: number;
  color?: string;
  size?: string;
  weight?: string;
  dimension?: string;
};

export type CartItem = {
  id: string | number;
  name: string;
  description?: string;
  displayImage?: any;
  price?: number;
  salesPrice?: number;
  colors?: string[];
  sizes?: string[];
  weights?: string[];
  dimensions?: string[];
  variant: CartVariant;
  product?: any;
};

export type CartItemInput = CartItem;

export interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItemInput, isSubmit?: boolean) => void;
  removeFromCart: (id: string | number) => void;
  incrementQty: (id: string | number) => void;
  decrementQty: (id: string | number) => void;
  clearCart: () => void;
}

export type Variant = {
  id: string;
  productId: string;
  sizeId?: string | null;
  colorId?: string | null;
  typeId?: string | null;
  weight?: number | null;
  dimension?: string | null;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isDeleted: boolean;
  size?: { id: string; name: string } | null;
  color?: { id: string; name: string } | null;
};

export type IncomingCartItem = {
  id: string;
  images: string[];
  variations: string[];
  attributes: ProductAttribute[];
  reviews: ProductReview[];
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
  variant?: any;
};
