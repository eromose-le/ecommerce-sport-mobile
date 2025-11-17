import { Logger } from "@/utils/logger";
import React from "react";
import { Image, ScrollView, View } from "react-native";

export default function ProductGallery({ images }: { images: string[] }) {
  Logger.error("images", images);
  return (
    <View className="flex items-center justify-start px-4">
      <Image
        source={{ uri: images[0] }}
        className="w-[70%] bg-gray-200 h-80"
        resizeMode="cover"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
      >
        {images.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img }}
            className="w-16 h-16 mr-3 bg-gray-200 rounded-md"
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
}
