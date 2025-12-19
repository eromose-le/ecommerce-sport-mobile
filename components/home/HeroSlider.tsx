import { BodyText, Heading } from "@/components/ui";
import { PRODUCTS_PUBLIC } from "@/constants/urls";
import { Ionicons } from "@expo/vector-icons";
import classNames from "classnames";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  type ImageSourcePropType,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type Slide = {
  id: string;
  kicker?: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  align?: "left" | "center" | "right";
};

const SLIDES: Slide[] = [
  {
    id: "december-sale",
    kicker: "Festive deals",
    title: "Explore our December sales",
    description: "Enjoy mouth watering discounts up to 60%",
    image: require("@/assets/images/banner/banner1.png"),
    align: "left",
  },
  {
    id: "christmas-sale",
    kicker: "Christmas sale",
    title: "Explore our December sales",
    description: "Enjoy mouth watering discounts up to 20%",
    image: require("@/assets/images/banner/banner2.png"),
    align: "center",
  },
  {
    id: "holiday-apparels",
    kicker: "Holiday sales",
    title: "Holiday sales on apparels",
    description: "Gear up with festive discounts up to 40% off.",
    image: require("@/assets/images/banner/banner3.png"),
    align: "center",
  },
  {
    id: "holiday-weights",
    kicker: "Seasonal picks",
    title: "Holiday sales",
    description: "Get up to 40% off select gym essentials.",
    image: require("@/assets/images/banner/banner4.png"),
    align: "left",
  },
  {
    id: "gym-equipment",
    kicker: "Limited time",
    title: "The best discounts on every gym equipment this festive period",
    description: "Get up to 40% off across the collection.",
    image: require("@/assets/images/banner/banner5.png"),
    align: "right",
  },
];

const alignmentMap = {
  left: {
    container: "items-start self-start",
    text: "left",
  },
  center: {
    container: "items-center self-center",
    text: "center",
  },
  right: {
    container: "items-end self-end",
    text: "right",
  },
} as const;

const overlayMap = {
  left: "bg-black/60",
  center: "bg-black/45",
  right: "bg-black/60",
} as const;

export default function HeroSlider() {
  const { width } = useWindowDimensions();
  const sliderHeight = Math.round(width * 0.55);
  const listRef = useRef<FlatList<Slide>>(null);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = SLIDES.length;
  const activeSlide = SLIDES[Math.min(current, slideCount - 1)] ?? SLIDES[0];
  const alignment = alignmentMap[activeSlide.align ?? "left"];
  const overlayClass = overlayMap[activeSlide.align ?? "left"];

  useEffect(() => {
    if (isPaused || slideCount <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (current + 1) % slideCount;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrent(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [current, isPaused, slideCount]);

  const goTo = (index: number) => {
    if (index < 0 || index >= slideCount) return;
    listRef.current?.scrollToIndex({ index, animated: true });
    setCurrent(index);
  };

  const handleMomentumEnd = (event: any) => {
    const offsetX = event?.nativeEvent?.contentOffset?.x ?? 0;
    const nextIndex = Math.round(offsetX / width);
    setCurrent(nextIndex);
  };

  const handlePrev = () => goTo((current - 1 + slideCount) % slideCount);
  const handleNext = () => goTo((current + 1) % slideCount);

  return (
    <View className="mt-4">
      <View className="relative overflow-hidden rounded-3xl">
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}
          onScrollBeginDrag={() => setIsPaused(true)}
          onScrollEndDrag={() => setIsPaused(false)}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 200);
          }}
          renderItem={({ item }) => (
            <View style={{ width, height: sliderHeight }}>
              <Image
                source={item.image}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          )}
        />

        <View
          pointerEvents="none"
          className={classNames("absolute inset-0", overlayClass)}
        />

        <View className="absolute inset-0 justify-center px-6 py-6">
          <View
            className={classNames(
              "max-w-[280px] space-y-2",
              alignment.container
            )}
          >
            {activeSlide.kicker ? (
              <BodyText
                size="xs"
                tone="inverse"
                weight="semibold"
                uppercase
                align={alignment.text}
                className="text-white/70"
              >
                {activeSlide.kicker}
              </BodyText>
            ) : null}
            <Heading
              level="h1"
              tone="inverse"
              uppercase
              align={alignment.text}
              className="leading-tight"
            >
              {activeSlide.title}
            </Heading>
            <BodyText
              size="sm"
              tone="inverse"
              weight="medium"
              uppercase
              align={alignment.text}
              className="text-white/80"
            >
              {activeSlide.description}
            </BodyText>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(PRODUCTS_PUBLIC)}
              className="px-6 py-3 mt-2 bg-white rounded-full"
            >
              <BodyText
                size="sm"
                weight="semibold"
                tone="primary"
                align="center"
              >
                Shop now
              </BodyText>
            </TouchableOpacity>
          </View>
        </View>

        <View className="absolute left-0 right-0 flex-row justify-center gap-2 bottom-4">
          {SLIDES.map((slide, index) => {
            const isActive = index === current;
            return (
              <TouchableOpacity
                key={slide.id}
                onPress={() => goTo(index)}
                activeOpacity={0.8}
                className="px-1"
                accessibilityLabel={`Go to slide ${index + 1}`}
              >
                <View
                  className={classNames(
                    "h-2.5 rounded-full",
                    isActive ? "w-7 bg-white" : "w-2.5 bg-white/60"
                  )}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {slideCount > 1 ? (
          <>
            <TouchableOpacity
              onPress={handlePrev}
              activeOpacity={0.8}
              style={{ top: sliderHeight / 2 - 18 }}
              className="absolute items-center justify-center rounded-full left-3 h-9 w-9 bg-black/45"
              accessibilityLabel="Previous banner"
            >
              <Ionicons name="chevron-back" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              style={{ top: sliderHeight / 2 - 18 }}
              className="absolute items-center justify-center rounded-full right-3 h-9 w-9 bg-black/45"
              accessibilityLabel="Next banner"
            >
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
}
