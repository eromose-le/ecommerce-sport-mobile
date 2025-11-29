import { PROFILE } from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useThemedStyles } from "@/providers/theme";
import classNames from "classnames";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { BodyText } from "../ui";
import Logo from "./Logo";

const AppProtectedHeader = () => {
  const theme = useThemedStyles();
  const { user } = useAuthUser();

  const userName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Guest";

  return (
    <View className="flex-row items-center justify-between mb-2">
      <Logo />

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => router.push(PROFILE)}
          className={classNames(
            "items-center justify-center rounded-full w-9 h-9",
            theme.pageBg,
            theme.primaryBorderColor,
            "border"
          )}
        >
          <BodyText size="xs" tone={theme.headingTone} weight="light">
            {userName[0] ?? "Avatar"}
          </BodyText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppProtectedHeader;
