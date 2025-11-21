import React from "react";
import { Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
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
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="bottom"
      occupyFullBottom
      dismissOnBackdropPress={false}
      // contentHeight="42%"
    >
      <SafeAreaView className="relative">
        <View className="flex-row items-baseline justify-between gap-2 mb-4">
          <View className="flex-1">
            <Text className="text-lg font-jost-semibold text-primary">
              Write a review
            </Text>
            {productName ? (
              <Text className="mt-0.5 text-xs text-secondary">
                {productName}
              </Text>
            ) : null}
          </View>
        </View>

        <ReviewForm productId={productId} onClose={onClose} />
      </SafeAreaView>
    </Modal>
  );
};

export default ReviewModal;
