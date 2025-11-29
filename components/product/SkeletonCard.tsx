import { useThemedStyles } from "@/providers/theme";
import classNames from "classnames";
import React from "react";
import { View } from "react-native";

interface SkeletonCardProps {
  width: number;
  horizontal?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width,
  horizontal,
}) => {
  const theme = useThemedStyles();
  const baseShimmer = theme.surface.includes("bg-black")
    ? "bg-gray-700"
    : "bg-gray-200";

  return (
    <View
      style={{ width }}
      className={classNames("p-3 rounded-md", theme.surface)}
    >
      {/* Skeleton Image */}
      <View
        className={`w-full ${horizontal ? "h-32" : "h-40"} ${baseShimmer} rounded-md animate-pulse`}
      />

      {/* Name */}
      <View
        className={`w-3/4 h-4 mt-3 mb-2 ${baseShimmer} rounded-md animate-pulse`}
      />

      {/* Brand */}
      <View
        className={`w-1/2 h-4 mb-2 ${baseShimmer} rounded-md animate-pulse`}
      />

      {/* Price + Button */}
      <View className="flex-row items-center justify-between mt-2">
        <View className={`w-12 h-4 ${baseShimmer} rounded-md animate-pulse`} />
        <View className={`w-8 h-8 ${baseShimmer} rounded-full animate-pulse`} />
      </View>
    </View>
  );
};
