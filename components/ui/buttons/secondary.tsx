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
  const themed = useThemedStyles();
  const resolvedSpinner = spinnerColor ?? themed.secondarySpinnerColor;

  const isDisabled = !!disabled || !!loading;
  const containerClass = buttonContainerVariants({
    variant: "secondary",
    size,
    fullWidth,
    align,
    disabled: isDisabled,
    className: [themed.secondaryButtonClass, className]
      .filter(Boolean)
      .join(" "),
  });

  const labelClass = buttonLabelVariants({
    variant: "secondary",
    size,
    uppercase,
    className: [themed.secondaryTextClass, textClassName]
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
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <>
            <ActivityIndicator color={resolvedSpinner} size="small" />
            <Text className={labelClass}>{loadingText}</Text>
          </>
        ) : (
          <Text className={labelClass}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
