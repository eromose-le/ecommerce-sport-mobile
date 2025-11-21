import { PAGINATION_DEFAULT } from "@/constants";
import { api } from "@/services/api/api";
import { Logger } from "@/utils/logger";
import {
  CreateReviewPayload,
  FetchReviewsParams,
  ReviewResponse,
  ReviewSummaryResponse,
  ReviewsResponse,
} from "./review.types";

export const fetchReviews = async (
  params: FetchReviewsParams
): Promise<ReviewsResponse> => {
  try {
    const response = await api.get("/reviews/me", {
      params: {
        page: params.page ?? PAGINATION_DEFAULT.page,
        limit: params.limit ?? PAGINATION_DEFAULT.limit,
        productId: params.productId,
        userId: params.userId,
      },
    });

    if (response?.data?.success) {
      return response.data;
    }

    throw new Error(response?.data?.error || "Unable to fetch reviews");
  } catch (error) {
    Logger.error("fetchReviews Error", error);
    throw error;
  }
};

export const fetchReviewSummary = async (
  productId: string
): Promise<ReviewSummaryResponse> => {
  try {
    const response = await api.get(`/reviews/summary/${productId}`);

    if (response?.data?.success) {
      return response.data;
    }

    throw new Error(response?.data?.error || "Unable to fetch review summary");
  } catch (error) {
    Logger.error("fetchReviewSummary Error", error);
    throw error;
  }
};

export const fetchUserReview = async (
  productId: string,
  userId: string
): Promise<ReviewsResponse> => {
  try {
    const response = await api.get("/reviews/me", {
      params: { productId, userId },
    });

    if (response?.data?.success) {
      return response.data;
    }

    throw new Error(
      response?.data?.error || "Unable to fetch review for this product"
    );
  } catch (error) {
    Logger.error("fetchUserReview Error", error);
    throw error;
  }
};

export const createReview = async (
  payload: CreateReviewPayload
): Promise<ReviewResponse> => {
  try {
    const response = await api.post("/reviews", payload);

    if (response?.data?.success) {
      return response.data;
    }
    throw new Error(response?.data?.error || "Unable to submit review");
  } catch (error) {
    Logger.error("createReview Error", error);
    throw error;
  }
};
