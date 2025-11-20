import GoodIcon from "@/assets/icons/good.svg";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "@/components/common/SecondaryButton";
import { SvgIcon } from "@/components/common/SvgIcon";
import { SIGN_IN, SIGN_UP } from "@/constants/urls";
import { onboardingSlides } from "@/lib/dummy-data";
import { useAuth } from "@/providers/auth";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnBoarding() {
  const { skipLogin } = useAuth();
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
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Absolute top image section (fully covers top, NOT safe area bounded) */}
      <View className="absolute top-0 left-0 right-0 overflow-hidden">
        <FlatList
          ref={flatRef}
          data={onboardingSlides}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <Image
                source={item.image}
                resizeMode="cover"
                style={{
                  width: "100%",
                  height: height * 0.5, // covers full top area
                }}
              />
            </View>
          )}
        />
      </View>

      {/* Overlay for skip button — inside safe area */}
      <SafeAreaView
        style={{ position: "absolute", top: 0, right: 0, left: 0, zIndex: 50 }}
      >
        <View className="flex-row justify-end px-4 mt-2">
          <SecondaryButton
            title="Skip"
            onPress={skipLogin}
            textClassName="text-white text-lg underline font-jost-semibold"
            className="bg-transparent border-transparent w-fit"
          />
        </View>
      </SafeAreaView>

      {/* Content area BELOW the image, inside safe area */}
      <SafeAreaView style={{ flex: 1, marginTop: height * 0.46 }}>
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-12 space-x-1">
          {onboardingSlides.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                index === i ? "bg-black w-6" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </View>

        {/* Slide Text */}
        <View className="items-center px-6">
          <Text className="text-center text-[24px] font-jost-bold max-w-60">
            {onboardingSlides[index].title}{" "}
            <Text className="font-extrabold">
              {onboardingSlides[index].highlight}
            </Text>
          </Text>

          <View className="items-center gap-3 mt-5 space-y-3">
            {onboardingSlides[index].bullets.map((line: any, idx: number) => (
              <View key={idx} className="flex-row items-center gap-2 space-x-2">
                <Text className="text-lg text-green-600">
                  <SvgIcon Icon={GoodIcon} size={16} />
                </Text>
                <Text className="text-base font-jost">{line}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Buttons */}
        <View className="gap-3 px-6 mt-auto mb-10">
          <PrimaryButton
            title="Sign up"
            onPress={() => router.push(SIGN_UP)}
            loadingText="Signing In..."
            className="w-full"
          />

          <SecondaryButton
            title="Log in"
            onPress={() => {
              router.push({
                pathname: SIGN_IN,
                params: { fromOnboarding: "true" },
              });
            }}
            textClassName="text-primary underline"
            className="bg-white border-transparent w-fit"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
