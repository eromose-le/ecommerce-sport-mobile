import LabeledInput from "@/components/common/LabeledInput";
import StarRating from "@/components/review/StarRating";
import { BodyText, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useAuth } from "@/providers/auth";
import { useThemedStyles } from "@/providers/theme";
import { ReviewService } from "@/services/api";
import { CreateReviewPayload } from "@/services/review/review.types";
import { getFormikTextFieldProps } from "@/utils/formik";
import { AppToast } from "@/utils/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useMemo } from "react";
import { View } from "react-native";
import { number, object, string } from "yup";

type ReviewFormProps = {
  productId: string;
  defaultRating?: number;
  defaultComment?: string;
  onClose?: () => void;
  onSubmitted?: () => void;
};

const reviewSchema = object({
  rating: number()
    .min(1, "Please select a rating")
    .max(5, "Invalid rating")
    .required("Rating is required"),
  comment: string()
    .trim()
    .max(1000, "Keep it under 1000 characters")
    .nullable(),
});

const ReviewForm = ({
  productId,
  defaultComment,
  defaultRating,
  onClose,
  onSubmitted,
}: ReviewFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const theme = useThemedStyles();

  const initialValues = useMemo(
    () => ({
      rating: defaultRating ?? 0,
      comment: defaultComment ?? "",
    }),
    [defaultComment, defaultRating]
  );

  const submitMutation = useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      ReviewService.createReview(payload),
    onSuccess: async (res) => {
      AppToast.success(res?.message || "Review submitted");
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["productReviews", productId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reviewSummary", productId],
        }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
      ]);
      onSubmitted?.();
      onClose?.();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error || err?.message || "Unable to submit review";
      AppToast.failed(msg);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues,
    validationSchema: reviewSchema,
    onSubmit: (values) => {
      if (!user?.id) {
        AppToast.info("Please sign in to share a review");
        return;
      }

      const payload: CreateReviewPayload = {
        userId: user.id,
        productId,
        rating: values.rating,
        comment: values.comment?.trim() || undefined,
      };

      submitMutation.mutate(payload);
    },
  });

  const commentProps = getFormikTextFieldProps(formik, "comment");
  const ratingError =
    formik.touched.rating && typeof formik.errors.rating === "string"
      ? formik.errors.rating
      : undefined;

  const isSubmitting = submitMutation.isPending || formik.isSubmitting;
  const isValid = formik.isValid && !!formik.values.rating;

  return (
    <View className="gap-5">
      <View className="gap-2">
        <BodyText size="md" weight="semibold" tone={theme.headingTone}>
          Your rating
        </BodyText>
        <StarRating
          value={formik.values.rating}
          onChange={(val) => {
            formik.setFieldValue("rating", val);
            formik.setFieldTouched("rating", true, false);
          }}
          readOnly={isSubmitting}
          size={24}
        />
        {ratingError ? (
          <BodyText size="xs" tone="danger">
            {ratingError}
          </BodyText>
        ) : null}
      </View>

      <View>
        <LabeledInput
          label="Comment"
          placeholder="Share a few details about your experience (optional)"
          multiline
          numberOfLines={4}
          maxLength={1000}
          textAlignVertical="top"
          {...commentProps}
        />
        <View className="flex-row items-center justify-between mt-1">
          <BodyText size="xs" tone={theme.labelTone}>
            {commentProps.helperText || "Optional"}
          </BodyText>
          <BodyText size="xs" tone={theme.labelTone}>
            {`${commentProps.value?.length || 0}/1000`}
          </BodyText>
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        {onClose && (
          <SecondaryButton
            title="Cancel"
            onPress={onClose}
            disabled={isSubmitting}
            className={`${theme.pageBgInverse} flex-1 h-full border border-black`}
            textClassName={`${theme.secondaryTextClass}`}
            spinnerColor={theme.secondarySpinnerColor}
          />
        )}
        <PrimaryButton
          title={isSubmitting ? "Submitting..." : "Submit review"}
          onPress={formik.submitForm}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          className={`${theme.pageBg} flex-1 h-full`}
          textClassName={theme.primaryTextClass}
          spinnerColor={theme.primarySpinnerColor}
        />
      </View>
    </View>
  );
};

export default ReviewForm;
