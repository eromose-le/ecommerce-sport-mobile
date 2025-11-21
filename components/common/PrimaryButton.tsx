import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const PrimaryButton = ({
  title,
  onPress,
  loading,
  disabled,
  loadingText = "Saving...",
  className = "",
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  className?: string;
}) => {
  const isDisabled = !!disabled || !!loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`rounded-2xl bg-black py-3 max-h-[50px] ${
        isDisabled ? "opacity-60" : ""
      } ${className}`}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <>
            <ActivityIndicator
              color="#fff"
              size="small"
              style={{ marginRight: 8 }}
            />
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
