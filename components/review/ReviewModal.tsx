import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { useThemedStyles } from "@/providers/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "../common/Modal";
import { BodyText, Heading } from "../ui";
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
      contentHeight="55%"
    >
      <SafeAreaView
        className={`relative ${theme.mutedSurface}`}
        edges={["top", "left", "right", "bottom"]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className=""
        >
          <ScrollView
            className=""
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={true}
          >
            <View className="flex-row items-baseline justify-between gap-2 mb-4">
              <View className="flex-1">
                <Heading
                  level="h2"
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default ReviewModal;
