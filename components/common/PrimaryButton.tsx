import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const PrimaryButton = ({
  title,
  onPress,
  loading,
  disabled,
  loadingText = "Saving...",
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
}) => {
  const isDisabled = !!disabled || !!loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`mt-2 rounded-2xl bg-black py-4 ${
        isDisabled ? "opacity-60" : ""
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <>
            <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
            <Text className="text-base text-white font-jost-medium">
              {loadingText}
            </Text>
          </>
        ) : (
          <Text className="text-base text-center text-white font-jost-medium">
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
