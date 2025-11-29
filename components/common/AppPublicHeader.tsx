import { useAuth } from "@/providers/auth";
import { useThemedStyles } from "@/providers/theme";
import React from "react";
import { View } from "react-native";
import { BodyText } from "../ui";
import { BackButton } from "./BackButton";
import Logo from "./Logo";

const AppPublicHeader = () => {
  const theme = useThemedStyles();
  const { unSkipLogin } = useAuth();

  return (
    <View className="flex-row items-center justify-between mb-2">
      <Logo />

      <View className="items-center">
        <BackButton onPress={unSkipLogin} color={theme.primarySpinnerColor} />
        <BodyText size="xs" tone={theme.headingTone} weight="light">
          Sign in
        </BodyText>
      </View>
    </View>
  );
};

export default AppPublicHeader;
