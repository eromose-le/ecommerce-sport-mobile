import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProductDetailActions() {
  return (
    <View className="flex-row items-center gap-3 mt-6">
      <TouchableOpacity className="flex-1 py-3 bg-black rounded">
        <Text className="text-xs text-center text-white font-jost-semibold">
          Start order
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-1 py-3 border rounded border-secondary">
        <Text className="text-xs text-center font-jost-semibold">
          Add to Cart
        </Text>
      </TouchableOpacity>
    </View>
  );
}
