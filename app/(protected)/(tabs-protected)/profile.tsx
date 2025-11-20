import {
  helpLinks,
  legalLinks,
  profileKeys,
  settingsLinks,
} from "@/components/profile/profile-constants";
import ProfileRow from "@/components/profile/ProfileRow";
import ProfileSection from "@/components/profile/ProfileSection";
import { AppEnv } from "@/constants/env";
import { NOTIFICATION_PROTECTED, PROFILE_DETAIL } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { ProfileLink, ScreenKey } from "@/types/profile";
import { exImageLink } from "@/utils/images";
import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const versionNumber = AppEnv.config.appVersion;

const navigateToProfileDetail = (key: ScreenKey) => {
  router.push({
    pathname: PROFILE_DETAIL,
    params: { id: encodeURIComponent(key) },
  });
};

export default function ProtectedProfile() {
  const { user, logout } = useAuth();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Guest";
  const avatarUri = user?.avatar || exImageLink(displayName);
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
      navigateToProfileDetail(link.key as ScreenKey);
      return;
    }

    AppToast.info("Feature coming soon");
  };

  const handleOrders = () => {
    navigateToProfileDetail(profileKeys.myOrders);
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

        <ProfileSection title="Settings">
          {settingsLinks.map((link) => (
            <ProfileRow
              key={link.key}
              link={link}
              onPress={() => handleLinkPress(link)}
              badge={
                link.key === profileKeys.notifications ? notificationCount : 0
              }
            />
          ))}
        </ProfileSection>

        <View className="h-px bg-[#E5E7EB] my-8" />

        <ProfileSection title="Help">
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
        </ProfileSection>

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
