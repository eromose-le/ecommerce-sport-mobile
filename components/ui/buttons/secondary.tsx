import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  buttonContainerVariants,
  buttonLabelVariants,
  type ButtonContainerVariants,
  type ButtonLabelVariants,
} from "./variants";

interface Props
  extends Omit<ButtonContainerVariants, "variant" | "size">,
    Omit<ButtonLabelVariants, "variant" | "size"> {
  title: string;
  loading?: boolean;
  loadingText?: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  spinnerColor?: string;
  size?: ButtonLabelVariants["size"];
}

export default function SecondaryButton({
  title,
  loading,
  disabled,
  loadingText = "Please wait...",
  onPress,
  className,
  textClassName,
  size,
  fullWidth,
  align,
  uppercase,
  spinnerColor = "#000",
}: Props) {
  const isDisabled = !!disabled || !!loading;
  const containerClass = buttonContainerVariants({
    variant: "secondary",
    size,
    fullWidth,
    align,
    disabled: isDisabled,
    className,
  });

  const labelClass = buttonLabelVariants({
    variant: "secondary",
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
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <>
            <ActivityIndicator color={spinnerColor} size="small" />
            <Text className={labelClass}>{loadingText}</Text>
          </>
        ) : (
          <Text className={labelClass}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
