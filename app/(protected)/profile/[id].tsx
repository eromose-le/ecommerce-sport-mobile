import { BackButton } from "@/components/common/BackButton";
import {
  profileKeys,
  SCREEN_LABELS,
} from "@/components/profile/profile-constants";
import { BodyText } from "@/components/ui";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { ScreenComponentProps, ScreenKey } from "@/types/profile";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSecurity from "./screens/AppSecurity";
import Appearance from "./screens/Appearance";
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
  [profileKeys.appearance]: () => <Appearance />,
  [profileKeys.deliveryAddress]: () => <DeliveryAddress />,
  [profileKeys.paymentMethods]: () => <PaymentMethods />,
  [profileKeys.appLock]: ({ screenKey }) => (
    <AppSecurity screenKey={screenKey} />
  ),
  [profileKeys.faq]: () => <Faq />,
  [profileKeys.support]: () => <Support />,
  [profileKeys.privacyPolicy]: () => <Policy type="privacy" />,
  [profileKeys.terms]: () => <Policy type="terms" />,
};

export default function ProfileDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  const screenKey = (params.id as ScreenKey) || profileKeys.userProfile;
  const ScreenComponent = SCREEN_COMPONENTS[screenKey] ?? ComingSoon;
  const title = SCREEN_LABELS[screenKey] || "Profile";

  return (
    <SafeAreaView className={`flex-1 ${theme.pageBg}`}>
      <View
        className="flex-row items-center px-6 py-4 border-b"
        style={{ borderColor: isDark ? "#1f2937" : "#e5e7eb" }}
      >
        <BackButton />

        <BodyText
          size="lg"
          weight="bold"
          tone={theme.headingTone}
          align="center"
          className="flex-1 pr-8"
        >
          {title}
        </BodyText>
      </View>

      <View className="flex-1">
        <ScreenComponent screenKey={screenKey} />
      </View>
    </SafeAreaView>
  );
}
