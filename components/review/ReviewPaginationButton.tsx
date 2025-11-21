import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

const ReviewPaginationButton = ({
  icon,
  disabled,
  onPress,
}: {
  icon: any;
  disabled?: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={`rounded-full border border-gray-200 p-2 ${disabled ? "opacity-40" : ""}`}
    >
      <Ionicons name={icon} size={18} color="#111" />
    </TouchableOpacity>
  );
};

export default ReviewPaginationButton;
