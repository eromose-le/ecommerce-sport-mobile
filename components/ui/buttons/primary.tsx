import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  buttonContainerVariants,
  buttonLabelVariants,
  type ButtonContainerVariants,
  type ButtonLabelVariants,
} from "./variants";

interface Props
  extends Omit<ButtonContainerVariants, "variant">,
    Omit<ButtonLabelVariants, "variant"> {
  title: string;
  loading?: boolean;
  loadingText?: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
}

export default function PrimaryButton({
  title,
  loading,
  loadingText = "Saving...",
  disabled,
  onPress,
  className,
  textClassName,
  size,
  fullWidth,
  align,
  uppercase,
}: Props) {
  const isDisabled = !!disabled || !!loading;
  const containerClass = buttonContainerVariants({
    variant: "primary",
    size,
    fullWidth,
    align,
    disabled: isDisabled,
    className,
  });

  const labelClass = buttonLabelVariants({
    variant: "primary",
    size,
    uppercase,
    className: textClassName,
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={containerClass}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <>
            <ActivityIndicator color="#fff" size="small" className="mr-2" />
            <Text className={labelClass}>{loadingText}</Text>
          </>
        ) : (
          <Text className={labelClass}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
