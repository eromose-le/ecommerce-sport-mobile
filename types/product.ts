export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;

  // Image used in ProductCard (local asset)
  image: any;

  // Images used in the gallery (remote/full res)
  images: string[];

  description: string;

  // e.g. color hex values
  variations: string[];

  attributes: ProductAttribute[];

  reviews: ProductReview[];
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
