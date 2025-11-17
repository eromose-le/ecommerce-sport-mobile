import { SIGN_IN, SIGN_UP, TABS_PUBLIC } from "@/constants/urls";
import { onboardingSlides } from "@/lib/dummy-data";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function OnBoarding() {
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  // Auto slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % onboardingSlides.length;
      flatRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [index]);

  const onScroll = (event: any) => {
    const slideIdx = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(slideIdx);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Skip Button */}
      <View className="absolute z-20 top-4 right-4">
        <TouchableOpacity onPress={() => router.replace(TABS_PUBLIC)}>
          <Text className="mt-12 text-xl underline font-jost-semibold text-background">
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image slider */}
      <FlatList
        ref={flatRef}
        data={onboardingSlides}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1">
            <Image
              source={item.image}
              className="h-[60%] w-full"
              resizeMode="cover"
            />

            {/* Pagination Dots */}
            <View className="flex-row justify-center mt-3 mb-4 space-x-1">
              {onboardingSlides.map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${
                    index === i ? "bg-black w-6" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </View>

            {/* Text content */}
            <View className="items-center px-6 mt-10">
              <Text className="text-center text-[24px] font-jost-bold max-w-60">
                {item.title}{" "}
                <Text className="font-extrabold">{item.highlight}</Text>
              </Text>

              <View className="items-center gap-2 mt-5 space-y-3">
                {item.bullets.map((line: any, idx: number) => (
                  <View
                    key={idx}
                    className="flex-row items-center gap-2 space-x-2"
                  >
                    <Text className="text-lg text-green-600">✔</Text>
                    <Text className="text-base font-jost">{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      />

      {/* Bottom Buttons */}
      <View className="px-6 mb-10">
        <TouchableOpacity
          onPress={() => router.push(SIGN_UP)}
          className="py-4 bg-black rounded-lg"
        >
          <Text className="text-base text-center text-white font-jost-medium">
            Sign up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push(SIGN_IN)} className="mt-4">
          <Text className="text-base text-center underline text-primary font-jost-medium">
            log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
