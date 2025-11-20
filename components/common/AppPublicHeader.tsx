import { useAuth } from "@/providers/auth";
import React from "react";
import { Text, View } from "react-native";
import { BackButton } from "./BackButton";
import Logo from "./Logo";

const AppPublicHeader = () => {
  const { unSkipLogin } = useAuth();

  return (
    <View className="flex-row items-center justify-between mb-2">
      <Logo />

      <View className="items-center">
        <BackButton onPress={unSkipLogin} />
        <Text className="mb-3 text-xs font-light text-secondary font-jost">
          Sign in
        </Text>
      </View>
    </View>
  );
};

export default AppPublicHeader;
