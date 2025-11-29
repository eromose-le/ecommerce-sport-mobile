import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useThemedStyles, useTheme } from "@/providers/theme";

const OrderPaginationButton = ({
  icon,
  disabled,
  onPress,
}: {
  icon: any;
  disabled?: boolean;
  onPress: () => void;
}) => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={`rounded-full border p-2 ${disabled ? "opacity-40" : ""} ${theme.primaryBorderColor}`}
      style={{
        backgroundColor: isDark ? "transparent" : "white",
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={isDark ? "#e5e7eb" : "#111"}
      />
    </TouchableOpacity>
  );
};

export default OrderPaginationButton;
