import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProductGallery({
  images = [],
}: {
  images: string[] | any;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages = images?.length ? images : [undefined as any];
  const current = safeImages[Math.min(activeIndex, safeImages.length - 1)];

  return (
    <View className="items-center justify-start px-4">
      <Image
        source={
          current ? { uri: current } : require("@/assets/images/dumbbell.png")
        }
        className="bg-gray-200 rounded-3xl"
        style={{ width: width - 60, height: width - 60 }}
        resizeMode="cover"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {safeImages.map((img: any, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveIndex(i)}
            className={`mr-3 rounded-xl ${activeIndex === i ? "border-2 border-black" : "border border-gray-200"}`}
          >
            <Image
              source={
                img ? { uri: img } : require("@/assets/images/dumbbell.png")
              }
              className="w-16 h-16 bg-gray-200 rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
