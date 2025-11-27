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
  spinnerColor = "#fff",
}: Props) {
  const themed = useThemedStyles();
  const resolvedSpinner = spinnerColor ?? themed.primarySpinnerColor;

  const isDisabled = !!disabled || !!loading;
  const containerClass = buttonContainerVariants({
    variant: "primary",
    size,
    fullWidth,
    align,
    disabled: isDisabled,
    className: [themed.primaryButtonClass, className].filter(Boolean).join(" "),
  });

  const labelClass = buttonLabelVariants({
    variant: "primary",
    size,
    uppercase,
    className: [themed.primaryTextClass, textClassName]
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
      <View className="flex-row items-center justify-center">
        {loading ? (
          <>
            <ActivityIndicator
              color={resolvedSpinner}
              size="small"
              className="mr-2"
            />
            <Text className={labelClass}>{loadingText}</Text>
          </>
        ) : (
          <Text className={labelClass}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
