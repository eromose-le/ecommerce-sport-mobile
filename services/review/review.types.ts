import { PaginatedServerResponse, ServerResponse } from "@/types/global";

export interface ReviewUser {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
}

export interface Review {
  id: string | number;
  userId?: string | number;
  productId: string | number;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  user?: ReviewUser;
}

export interface ReviewSummary {
  averageRating?: number;
  totalReviews?: number;
  ratingComment?: string;
}

export interface CreateReviewPayload {
  userId: string | number;
  productId: string | number;
  rating: number;
  comment?: string;
}

export type FetchReviewsParams = {
  productId: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  userId?: string | number;
};

export type ReviewsResponse = PaginatedServerResponse<Review>;
export type ReviewSummaryResponse = ServerResponse<ReviewSummary>;
export type ReviewResponse = ServerResponse<Review>;
