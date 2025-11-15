import React from "react";
import { Text, View } from "react-native";

export default function ProductAttributes({
  attributes,
}: {
  attributes: { title: string; text: string }[];
}) {
  return (
    <View className="px-4 mt-8">
      <Text className="mb-3 text-lg font-jost-bold">Key attributes</Text>

      <View className="border">
        {attributes.map((attr, i) => (
          <View key={i} className="flex-row bg-white border-b border-b-black last:border-b-0">
            <View className="w-40 p-3 border-r bg-[#F0F0F0]">
              <Text className="text-sm font-jost-medium text-primary">
                {attr.title}
              </Text>
            </View>

            <View className="flex-1 p-3">
              <Text className="text-xs text-primary">{attr.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
