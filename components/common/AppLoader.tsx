import React, { FC } from "react";
import { ActivityIndicator, View } from "react-native";

import Logo from "./Logo";

interface AppLoaderProps {
  size?: number;
}
const AppLoader: FC<AppLoaderProps> = () => {
  return (
    <View className="flex-col gap-2">
      <Logo size={50} />
      <ActivityIndicator size="small" />
    </View>
  );
};

export default AppLoader;
