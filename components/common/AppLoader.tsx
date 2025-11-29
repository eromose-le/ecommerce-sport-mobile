import React, { FC } from "react";
import { ActivityIndicator, View } from "react-native";

import { useThemedStyles } from "@/providers/theme";
import Logo from "./Logo";

interface AppLoaderProps {
  size?: number;
}
const AppLoader: FC<AppLoaderProps> = () => {
  const theme = useThemedStyles();
  return (
    <View className="flex-col gap-2 items-center">
      <Logo size={50} />
      <ActivityIndicator size="small" color={theme.primarySpinnerColor} />
    </View>
  );
};

export default AppLoader;
