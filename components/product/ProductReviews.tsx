import { LoadingContent } from "@/components/common/LoadingContent";
import StarRating from "@/components/review/StarRating";
import { getRatingComment } from "@/helpers/rating-review-map";
import { ReviewService } from "@/services/api";
import { Review } from "@/services/review/review.types";
import { safeFormatDate } from "@/utils/date";
import { resolveImageSource } from "@/utils/images";
import { Logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EmptyState } from "../common/EmptyState";
import ReviewPaginationButton from "../review/ReviewPaginationButton";

type ProductReviewsProps = {
  productId?: string | number;
  pageSize?: number;
  onAddReview?: () => void;
};

export default function ProductReviews({
  productId,
  pageSize = 3,
  onAddReview,
}: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const stringProductId = productId ? String(productId) : undefined;

  Logger.warn("stringProductId", stringProductId);

  useEffect(() => {
    setPage(1);
  }, [stringProductId]);

  const {
    data: reviewsResponse,
    isLoading: reviewsLoading,
    isFetching: reviewsFetching,
    error: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["productReviews", stringProductId, page, pageSize],
    queryFn: () =>
      ReviewService.fetchReviews({
        productId: stringProductId as string,
        page,
        limit: pageSize,
        sort: "asc",
      }),
    enabled: !!stringProductId,
  });

  const {
    data: summaryResponse,
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["reviewSummary", stringProductId],
    queryFn: () => ReviewService.fetchReviewSummary(stringProductId as string),
    enabled: !!stringProductId,
    staleTime: 1000 * 60 * 5,
  });

  const reviews = reviewsResponse?.data?.results ?? [];
  const totalPages = reviewsResponse?.data?.pageCount ?? 1;

  const averageRating = summaryResponse?.data?.averageRating ?? 0;
  const totalReviews = summaryResponse?.data?.totalReviews ?? 0;
  const summaryComment =
    summaryResponse?.data?.ratingComment ??
    getRatingComment(averageRating, totalReviews);

  const loading = reviewsLoading || summaryLoading;
  const error = reviewsError || summaryError;
  const isFetchingMore = reviewsFetching && !reviewsLoading;

  const handleRetry = () => {
    refetchReviews();
    refetchSummary();
  };

  const renderReviewerName = (review: Review) => {
    const first = review?.user?.firstName || "";
    const last = review?.user?.lastName || "";
    const combined = `${first} ${last}`.trim();
    return combined || "Anonymous buyer";
  };

  if (!stringProductId) {
    return (
      <View className="px-4 mt-8">
        <Text className="text-lg font-jost-bold text-primary">
          Ratings & Reviews
        </Text>
        <Text className="mt-2 text-sm text-secondary">
          Reviews are unavailable for this product.
        </Text>
      </View>
    );
  }

  return (
    <View className="px-4 mt-8">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-jost-bold text-primary">
          Ratings & Reviews
        </Text>

        {onAddReview && (
          <TouchableOpacity
            onPress={onAddReview}
            className="px-3 py-1 border rounded-full border-primary"
            activeOpacity={0.8}
          >
            <Text className="text-xs font-jost-medium text-primary">
              Write review
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="text-2xl font-jost-bold text-primary">
          {averageRating?.toFixed(1) ?? "0.0"}
          <Text className="text-sm text-primary font-jost">
            /{totalReviews}
          </Text>
        </Text>
        <Text className="text-base text-primary font-jost">
          {summaryComment}
        </Text>
      </View>

      <LoadingContent
        loading={loading}
        error={error}
        onRetry={handleRetry}
        data={reviews}
        EmptyComponent={(error, onRetry) => (
          <View className="items-center">
            <EmptyState
              icon={<Ionicons name="chatbox-outline" size={38} color="#ddd" />}
              error="No product found"
              onRetry={onRetry}
            />
          </View>
        )}
      >
        <>
          {reviews?.map((item: Review) => (
            <View key={item?.id} className="mt-6">
              <View className="flex-row items-center gap-3">
                <Image
                  source={resolveImageSource(item?.user?.avatar)}
                  className="bg-gray-200 rounded-full w-11 h-11"
                />
                <View>
                  <Text className="text-sm font-jost-semibold">
                    {renderReviewerName(item)}
                  </Text>
                  <Text className="text-xs text-primary">
                    {safeFormatDate(item?.createdAt)}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mt-3 mb-2">
                <StarRating value={item?.rating} readOnly size={16} />
              </View>

              {item?.comment ? (
                <Text className="mt-1 text-xs leading-6 text-primary">
                  {item?.comment}
                </Text>
              ) : null}
            </View>
          ))}

          {isFetchingMore && (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="#000" />
            </View>
          )}

          {totalPages > 1 && (
            <View className="flex-row items-center justify-center gap-4 pt-4 pb-10">
              <ReviewPaginationButton
                icon="chevron-back"
                disabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              />
              <Text className="text-sm text-secondary">
                Page {page} of {totalPages}
              </Text>
              <ReviewPaginationButton
                icon="chevron-forward"
                disabled={page === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </View>
          )}
        </>
      </LoadingContent>
    </View>
  );
}
