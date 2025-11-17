import * as React from "react";
import { View } from "react-native";
import AppLoader from "./AppLoader";

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <View className="items-center justify-center flex-1">
          <AppLoader />
        </View>
      }
    >
      {children}
    </React.Suspense>
  );
}
