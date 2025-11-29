import React from "react";
import { View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useThemedStyles } from "@/providers/theme";
import { BodyText, Heading } from "../ui";
import Modal from "../common/Modal";
import ReviewForm from "./ReviewForm";

type ReviewModalProps = {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productName?: string;
};

const ReviewModal = ({
  visible,
  onClose,
  productId,
  productName,
}: ReviewModalProps) => {
  const theme = useThemedStyles();

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="bottom"
      occupyFullBottom
      dismissOnBackdropPress={false}
      contentHeight="42%"
    >
      <SafeAreaView
        className={`relative ${theme.mutedSurface}`}
        edges={["top", "left", "right", "bottom"]}
      >
        <View className="flex-row items-baseline justify-between gap-2 mb-4">
          <View className="flex-1">
            <Heading
              level="h3"
              weight="semibold"
              tone={theme.headingTone}
              className="text-lg"
            >
              Write a review
            </Heading>
            {productName ? (
              <BodyText size="xs" tone={theme.labelTone} className="mt-0.5">
                {productName}
              </BodyText>
            ) : null}
          </View>
        </View>

        <ReviewForm productId={productId} onClose={onClose} />
      </SafeAreaView>
    </Modal>
  );
};

export default ReviewModal;
