import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

export default function ProductReviews({ reviews }: any) {
  return (
    <View className="px-4 mt-8">
      <Text className="mb-1 text-lg font-jost-bold text-primary">
        Ratings & Reviews
      </Text>

      <View className="flex-row items-center gap-2">
        <Text className="text-2xl font-jost-bold">
          5.0
          <Text className="text-sm text-primary font-jost">/5</Text>
        </Text>
        <Text className="text-base text-primary font-jost">Very satisfied</Text>
      </View>

      {reviews.map((item: any) => (
        <View key={item.id} className="mt-6">
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: item.avatar }}
              className="bg-gray-200 rounded-full w-11 h-11"
            />
            <View>
              <Text className="text-sm font-jost-semibold">
                {item.username}
              </Text>
              <Text className="text-xs text-primary">{item.date}</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-3 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name="star"
                size={16}
                color={i < item.rating ? "#A8C302" : "#ddd"}
              />
            ))}
          </View>

          <Text className="mt-1 text-xs leading-6 text-primary">
            {item.comment}
          </Text>
        </View>
      ))}
    </View>
  );
}
