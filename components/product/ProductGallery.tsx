import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type MediaItem = {
  uri?: string;
  isVideo?: boolean;
  videoUrl?: string;
  poster?: string;
};

type ProductGalleryProps = {
  images?: string[];
  medias?: any[];
};

export default function ProductGallery({
  images = [],
  medias = [],
}: ProductGalleryProps) {
  const parsedMedia: MediaItem[] = useMemo(() => {
    const items: MediaItem[] = [];
    const pushImage = (uri?: string) => {
      if (uri) items.push({ uri, isVideo: false });
    };

    const pushVideo = (thumb?: string, videoUrl?: string) => {
      if (thumb || videoUrl) {
        items.push({
          uri: thumb || videoUrl,
          isVideo: true,
          videoUrl,
          poster: thumb,
        });
      }
    };

    (medias || []).forEach((media: any) => {
      if (media?.type === "video") {
        pushVideo(media?.displayImage, media?.links?.introVideo);
      } else if (Array.isArray(media?.images) && media.images.length) {
        media.images.forEach((img: string) => pushImage(img));
      } else if (media?.displayImage) {
        pushImage(media.displayImage);
      }
    });

    if (items.length === 0 && Array.isArray(images) && images.length) {
      images.forEach((img) => pushImage(img));
    }

    if (items.length === 0) {
      items.push({ uri: undefined, isVideo: false });
    }

    return items;
  }, [images, medias]);

  const [activeIndex, setActiveIndex] = useState(0);
  const videoUrl = parsedMedia[activeIndex]?.isVideo
    ? parsedMedia[activeIndex]?.videoUrl || parsedMedia[activeIndex]?.uri
    : undefined;
  const player = useVideoPlayer(videoUrl ?? null, (playerInstance) => {
    if (playerInstance) {
      playerInstance.loop = false;
      playerInstance.play();
    }
  });

  useEffect(() => {
    if (!parsedMedia.length) return;
    const current = parsedMedia[Math.min(activeIndex, parsedMedia.length - 1)];

    let interval: ReturnType<typeof setInterval> | undefined;
    let cleanupListener: (() => void) | undefined;

    if (current?.isVideo) {
      if (player) {
        player.loop = false;
        player.play();
        const sub = player.addListener("playToEnd", () => {
          setActiveIndex((prev) => (prev + 1) % parsedMedia.length);
        });
        cleanupListener = () => sub?.remove?.();
      }
    } else {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % parsedMedia.length);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
      cleanupListener?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, parsedMedia.length, player]);

  const current = parsedMedia[Math.min(activeIndex, parsedMedia.length - 1)];

  return (
    <View className="items-center justify-start px-4">
      {current?.isVideo && videoUrl ? (
        <View
          className="overflow-hidden bg-black rounded-3xl"
          style={{ width: width - 60, height: width - 60 }}
        >
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            fullscreenOptions={{ enable: true }}
            allowsPictureInPicture
            nativeControls
            contentFit="contain"
          />
          <View className="absolute inset-0 items-center justify-center pointer-events-none">
            <View className="items-center justify-center rounded-full w-14 h-14 bg-black/40">
              <Ionicons name="play" size={28} color="#fff" />
            </View>
          </View>
        </View>
      ) : (
        <Image
          source={
            current?.uri
              ? { uri: current.uri }
              : require("@/assets/images/logo.png")
          }
          className="bg-gray-200 rounded-3xl"
          style={{ width: width - 60, height: width - 60 }}
          resizeMode="cover"
        />
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {parsedMedia.map((media, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveIndex(i)}
            className={`mr-3 rounded-xl ${
              activeIndex === i
                ? "border-2 border-black"
                : "border border-gray-200"
            }`}
          >
            <Image
              source={
                media?.uri
                  ? { uri: media.uri }
                  : require("@/assets/images/dumbbell.png")
              }
              className="w-16 h-16 bg-gray-200 rounded-lg"
              resizeMode="cover"
            />
            {media?.isVideo ? (
              <View className="absolute inset-0 items-center justify-center">
                <View className="items-center justify-center w-6 h-6 rounded-full bg-black/70">
                  <Ionicons name="play" size={14} color="#fff" />
                </View>
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
