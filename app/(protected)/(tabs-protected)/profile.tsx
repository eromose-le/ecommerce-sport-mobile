import {
  helpLinks,
  legalLinks,
  profileKeys,
  settingsLinks,
} from "@/components/profile/profile-constants";
import ProfileRow from "@/components/profile/ProfileRow";
import ProfileSection from "@/components/profile/ProfileSection";
import { BodyText, Heading, LinkButton } from "@/components/ui";
import { AppEnv } from "@/constants/env";
import { NOTIFICATION_PROTECTED, PROFILE_DETAIL } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { ProfileLink, ScreenKey } from "@/types/profile";
import { exImageLink } from "@/utils/images";
import { AppToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Switch, TouchableOpacity, View } from "react-native";
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
  const theme = useThemedStyles();
  const { isDark, setTheme } = useTheme();
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
    <SafeAreaView className={`flex-1 ${theme.pageBg}`}>
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <View className="items-center mt-10">
          <Image
            source={{ uri: avatarUri }}
            className="mb-4 rounded-full w-28 h-28"
          />
          <Heading level="h2" weight="bold" tone={theme.headingTone}>
            {displayName}
          </Heading>
        </View>

        <TouchableOpacity
          className={`flex-row items-center justify-between mt-12 p-4 rounded-2xl border shadow-sm ${theme.surface} ${theme.primaryBorderColor}`}
          onPress={handleOrders}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center gap-4">
            <Ionicons
              name="cart-outline"
              size={26}
              color={theme.headingTone === "inverse" ? "#f5f5f5" : "#111"}
            />
            <BodyText size="lg" weight="medium" tone={theme.headingTone}>
              My Orders
            </BodyText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.headingTone === "inverse" ? "#f5f5f5" : "#111"}
          />
        </TouchableOpacity>

        <View
          className="h-px my-8"
          style={{ backgroundColor: isDark ? "#1f2937" : "#E5E7EB" }}
        />

        <ProfileSection title="Settings">
          <View className="flex-row items-center justify-between px-1 py-2">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-[#F5F5F5] items-center justify-center">
                <Ionicons
                  name={isDark ? "moon" : "moon-outline"}
                  size={18}
                  color="#4B5563"
                />
              </View>
              <BodyText size="md" weight="medium" tone={theme.headingTone}>
                Dark mode
              </BodyText>
            </View>
            <Switch
              value={isDark}
              onValueChange={(val) => setTheme(val ? "dark" : "light")}
              trackColor={{ false: "#E5E7EB", true: "#111827" }}
              thumbColor={isDark ? "#F9FAFB" : "#111827"}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
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

        <View
          className="h-px my-8"
          style={{ backgroundColor: isDark ? "#1f2937" : "#E5E7EB" }}
        />

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
                <LinkButton
                  title={link.label}
                  onPress={() => handleLinkPress(link)}
                />
                {index < legalLinks.length - 1 && (
                  <BodyText tone={theme.labelTone}>|</BodyText>
                )}
              </View>
            ))}
          </View>
          <BodyText size="xs" tone={theme.labelTone} className="mt-6">
            Version {versionNumber}
          </BodyText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
