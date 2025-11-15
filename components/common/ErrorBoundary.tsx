import * as React from "react";
import { View, Text } from "react-native";

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <View className="flex-1 items-center justify-center">
          <Text>Loading...</Text>
        </View>
      }
    >
      {children}
    </React.Suspense>
  );
}
