import classNames from "classnames";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const SecondaryButton = ({
  title,
  onPress,
  disabled,
  loading,
  loadingText = "Please wait...",
  className = "",
  textClassName = "text-primary",
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  textClassName?: string;
}) => {
  const isDisabled = !!disabled || !!loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isDisabled}
      className={classNames(
        className && className,
        isDisabled ? "opacity-60 border-[#bcbcbd]" : "border-black",
        "rounded-2xl border border-black py-3 max-h-[50px] bg-transparent"
      )}
    >
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <>
            <ActivityIndicator color="#000" size="small" />
            <Text className={`text-base font-jost-medium ${textClassName}`}>
              {loadingText}
            </Text>
          </>
        ) : (
          <Text
            className={`text-base text-center font-jost-medium ${textClassName}`}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SecondaryButton;
