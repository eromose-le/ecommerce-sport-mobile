import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useThemedStyles } from "@/providers/theme";
import {
  buttonContainerVariants,
  buttonLabelVariants,
  type ButtonContainerVariants,
  type ButtonLabelVariants,
} from "./variants";

interface Props
  extends Omit<ButtonContainerVariants, "variant" | "size">,
    Omit<ButtonLabelVariants, "variant"> {
  title: string;
  loading?: boolean;
  loadingText?: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  spinnerColor?: string;
}

export default function LinkButton({
  title,
  loading,
  loadingText = "Please wait...",
  disabled,
  onPress,
  className,
  textClassName,
  size = "md",
  align,
  uppercase,
  spinnerColor,
}: Props) {
  const themed = useThemedStyles();
  const resolvedSpinner = spinnerColor ?? themed.linkSpinnerColor;

  const isDisabled = !!disabled || !!loading;

  const containerClass = buttonContainerVariants({
    variant: "link",
    size: "none",
    align,
    disabled: isDisabled,
    className,
  });

  const labelClass = buttonLabelVariants({
    variant: "link",
    size,
    uppercase,
    className: [themed.linkTextClass, textClassName]
      .filter(Boolean)
      .join(" "),
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={containerClass}
    >
      <View className="flex-row items-center gap-2">
        {loading ? (
          <ActivityIndicator color={resolvedSpinner} size="small" />
        ) : null}
        <Text className={labelClass}>{loading ? loadingText : title}</Text>
      </View>
    </TouchableOpacity>
  );
}
