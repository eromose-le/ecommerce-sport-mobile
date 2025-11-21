import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type StarRatingProps = {
  value?: number;
  readOnly?: boolean;
  size?: number;
  onChange?: (value: number) => void;
  className?: string;
};

const StarRating = ({
  value = 0,
  readOnly,
  size = 18,
  onChange,
  className = "",
}: StarRatingProps) => {
  const effectiveValue = Number.isFinite(value) ? Math.max(0, value) : 0;

  const handlePress = (index: number) => {
    if (readOnly || !onChange) return;
    onChange(index + 1);
  };

  return (
    <View className={`flex-row items-center ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < effectiveValue;
        return (
          <TouchableOpacity
            key={index}
            disabled={readOnly}
            onPress={() => handlePress(index)}
            activeOpacity={0.7}
            className="mr-1.5"
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={size}
              color={filled ? "#A8C302" : "#D1D5DB"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default StarRating;
