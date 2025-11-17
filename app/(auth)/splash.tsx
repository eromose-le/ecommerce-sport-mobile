import AppLoader from "@/components/common/AppLoader";
import { Logger } from "@/utils/logger";
import { View } from "react-native";

export default function SplashScreen() {
  Logger.warn("SPLASH ==::");

  // This is purely a UI placeholder now.
  // Navigation is handled by RootLayout + PublicLayout.
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <AppLoader />
    </View>
  );
}
