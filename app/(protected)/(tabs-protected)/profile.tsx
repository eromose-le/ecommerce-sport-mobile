import { NOTIFICATION_PROTECTED } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconName = keyof typeof Ionicons.glyphMap;

type ProfileLink = {
  key: string;
  label: string;
  icon: IoniconName;
  onPress?: () => void;
};

const versionNumber = process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0";

const settingsLinks: ProfileLink[] = [
  { key: "user-profile", label: "User profile", icon: "person-outline" },
  { key: "payment-methods", label: "Payment methods", icon: "wallet-outline" },
  {
    key: "delivery-address",
    label: "Delivery address",
    icon: "location-outline",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: "notifications-outline",
  },
];

const helpLinks: ProfileLink[] = [
  { key: "faq", label: "FAQ", icon: "help-circle-outline" },
  { key: "support", label: "Support", icon: "chatbubble-ellipses-outline" },
];

const legalLinks: ProfileLink[] = [
  {
    key: "privacy-policy",
    label: "Privacy policy",
    icon: "document-text-outline",
  },
  {
    key: "terms",
    label: "Terms & Conditions",
    icon: "reader-outline",
  },
];

const getRouteFromKey = (key: string) => ({
  pathname: "/(protected)/profile/[screen]" as const,
  params: { screen: key },
});

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Guest";
  const avatarUri =
    user?.avatar ||
    "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1";
  const notificationCount = Number(user?.unreadNotifications ?? 0);

  const handleLinkPress = (link: ProfileLink) => {
    if (link.key === "notifications") {
      router.push({ pathname: NOTIFICATION_PROTECTED });
      return;
    }

    if (link.onPress) {
      link.onPress();
      return;
    }

    if (link.key) {
      router.push(getRouteFromKey(link.key));
      return;
    }

    AppToast.info("Feature coming soon");
  };

  const handleOrders = () => {
    router.push(getRouteFromKey("my-orders"));
  };

  const handleLogout = async () => {
    try {
      await logout();
      AppToast.success("Logged out");
    } catch (error) {
      AppToast.failed("Unable to logout", error as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <View className="items-center mt-10">
          <Image
            source={{ uri: avatarUri }}
            className="mb-4 rounded-full w-28 h-28"
          />
          <Text className="text-2xl text-primary font-jost-bold">
            {displayName}
          </Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-between mt-12 p-4 bg-white border border-[#F1F1F1] rounded-2xl shadow-sm"
          onPress={handleOrders}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center gap-4">
            <Ionicons name="cart-outline" size={26} color="#000" />
            <Text className="text-lg font-jost-medium text-primary">
              My Orders
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        <View className="h-px bg-[#E5E7EB] my-8" />

        <Section title="Settings">
          {settingsLinks.map((link) => (
            <ProfileRow
              key={link.key}
              link={link}
              onPress={() => handleLinkPress(link)}
              badge={link.key === "notifications" ? notificationCount : 0}
            />
          ))}
        </Section>

        <View className="h-px bg-[#E5E7EB] my-8" />

        <Section title="Help">
          {helpLinks.map((link) => (
            <ProfileRow
              key={link.key}
              link={link}
              onPress={() => handleLinkPress(link)}
            />
          ))}

          <ProfileRow
            link={{ key: "logout", label: "Logout", icon: "log-out-outline" }}
            onPress={handleLogout}
          />
        </Section>

        <View className="items-center mt-12">
          <View className="flex-row items-center gap-2">
            {legalLinks.map((link, index) => (
              <View className="flex-row items-center gap-2" key={link.key}>
                <TouchableOpacity onPress={() => handleLinkPress(link)}>
                  <Text className="text-sm underline text-primary font-jost-medium">
                    {link.label}
                  </Text>
                </TouchableOpacity>
                {index < legalLinks.length - 1 && (
                  <Text className="text-secondary">|</Text>
                )}
              </View>
            ))}
          </View>
          <Text className="mt-6 text-xs text-secondary font-jost">
            Version {versionNumber}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View>
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-3">
        <Ionicons
          name={
            title === "Settings"
              ? "settings-outline"
              : "information-circle-outline"
          }
          size={18}
        />
        <Text className="text-lg font-jost-bold text-primary">{title}</Text>
      </View>
    </View>
    <View className="gap-3">{children}</View>
  </View>
);

const ProfileRow = ({
  link,
  onPress,
  badge = 0,
}: {
  link: ProfileLink;
  onPress: () => void;
  badge?: number;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between px-1 py-2"
    activeOpacity={0.8}
  >
    <View className="flex-row items-center gap-3">
      <View className="w-9 h-9 rounded-full bg-[#F5F5F5] items-center justify-center">
        <Ionicons name={link.icon} size={18} color="#4B5563" />
      </View>
      <Text className="text-base text-secondary font-jost-medium">
        {link.label}
      </Text>
    </View>
    {badge > 0 && (
      <View className="items-center justify-center w-5 h-5 mr-2 bg-red-500 rounded-full">
        <Text className="text-[10px] text-white font-jost-medium">{badge}</Text>
      </View>
    )}
    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
  </TouchableOpacity>
);
