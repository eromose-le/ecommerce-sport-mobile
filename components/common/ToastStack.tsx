import React from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const ToastStack = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ width: "100%", alignItems: "center", marginBottom: 10 }}>
        {children}
      </View>
    </GestureHandlerRootView>
  );
};
