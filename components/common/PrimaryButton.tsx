import React from "react";
import { Text, TouchableOpacity } from "react-native";

const PrimaryButton = ({
  title,
  onPress,
  loading,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`mt-2 rounded-2xl bg-black py-4 ${loading ? "opacity-60" : ""}`}
    >
      <Text className="text-base text-center text-white font-jost-medium">
        {loading ? "Saving..." : title}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
