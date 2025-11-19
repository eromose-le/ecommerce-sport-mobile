import {
  profileKeys,
  SCREEN_LABELS,
} from "@/components/profile/profile-constants";
import { ScreenComponentProps, ScreenKey } from "@/types/profile";
import { Logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComingSoon from "./screens/ComingSoon";
import DeliveryAddress from "./screens/DeliveryAddress";
import Faq from "./screens/Faq";
import Orders from "./screens/Orders";
import PaymentMethods from "./screens/PaymentMethods";
import Policy from "./screens/Policy";
import Support from "./screens/Support";
import UserProfile from "./screens/UserProfile";

const SCREEN_COMPONENTS: Partial<
  Record<ScreenKey, React.FC<ScreenComponentProps>>
> = {
  [profileKeys.myOrders]: () => <Orders />,
  [profileKeys.userProfile]: () => <UserProfile />,
  [profileKeys.deliveryAddress]: () => <DeliveryAddress />,
  [profileKeys.paymentMethods]: () => <PaymentMethods />,
  [profileKeys.faq]: () => <Faq />,
  [profileKeys.support]: () => <Support />,
  [profileKeys.privacyPolicy]: () => <Policy type="privacy" />,
  [profileKeys.terms]: () => <Policy type="terms" />,
};

export default function ProfileDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const screenKey = (params.id as ScreenKey) || profileKeys.userProfile;
  const ScreenComponent = SCREEN_COMPONENTS[screenKey] ?? ComingSoon;
  const title = SCREEN_LABELS[screenKey] || "Profile";

  Logger.warn("PROFILE_DETAIL", { params, screenKey });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text className="flex-1 pr-8 text-lg text-center font-jost-bold text-primary">
          {title}
        </Text>
      </View>

      <View className="flex-1">
        <ScreenComponent screenKey={screenKey} />
      </View>
    </SafeAreaView>
  );
}
