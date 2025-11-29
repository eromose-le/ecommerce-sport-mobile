import { LoadingContent } from "@/components/common/LoadingContent";
import StarRating from "@/components/review/StarRating";
import { getRatingComment } from "@/helpers/rating-review-map";
import { useThemedStyles } from "@/providers/theme";
import { ReviewService } from "@/services/api";
import { Review } from "@/services/review/review.types";
import { safeFormatDate } from "@/utils/date";
import { resolveImageSource } from "@/utils/images";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { EmptyState } from "../common/EmptyState";
import ReviewPaginationButton from "../review/ReviewPaginationButton";
import { BodyText, Heading, SecondaryButton } from "../ui";

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
  const theme = useThemedStyles();
  const [page, setPage] = useState(1);
  const stringProductId = productId ? String(productId) : undefined;

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
        <Heading level="h4" weight="bold">
          Ratings & Reviews
        </Heading>
        <BodyText size="sm" tone={theme.labelTone} className="mt-2">
          Reviews are unavailable for this product.
        </BodyText>
      </View>
    );
  }

  return (
    <View className="px-4 mt-8">
      <View className="flex-row items-center justify-between mb-1">
        <Heading level="h4" weight="bold">
          Ratings & Reviews
        </Heading>

        {onAddReview && (
          <SecondaryButton
            size="sm"
            title="Write review"
            onPress={onAddReview}
            className={theme.secondaryButtonClass}
            textClassName={theme.secondaryTextClass}
            spinnerColor={theme.secondarySpinnerColor}
          />
        )}
      </View>

      <View className="flex-row items-center gap-2">
        <Heading level="h2" weight="bold">
          {averageRating?.toFixed(1) ?? "0.0"}
          <BodyText size="sm" weight="medium">
            /{totalReviews}
          </BodyText>
        </Heading>
        <BodyText size="md" weight="medium">
          {summaryComment}
        </BodyText>
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
              error="No reviews for product yet"
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
