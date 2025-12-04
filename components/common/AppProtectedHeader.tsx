import { PROFILE } from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useThemedStyles } from "@/providers/theme";
import { exImageLink } from "@/utils/images";
import classNames from "classnames";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Logo from "./Logo";

const AppProtectedHeader = () => {
  const theme = useThemedStyles();
  const { user } = useAuthUser();

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Guest";
  const avatarUri = user?.avatar || exImageLink(displayName);

  return (
    <View className="flex-row items-center justify-between mb-2">
      <Logo />

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => router.push(PROFILE)}
          className={classNames(
            "items-center justify-center rounded-full w-12 h-12",
            theme.pageBg,
            theme.primaryBorderColor,
            "border"
          )}
        >
          <Image
            source={{ uri: avatarUri }}
            className="w-10 h-10 rounded-full"
          />
          {/* <BodyText size="xs" tone={theme.headingTone} weight="light">
            {userName[0] ?? "Avatar"}
          </BodyText> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppProtectedHeader;
