import { useTheme, useThemedStyles } from "@/providers/theme";
import { ProfileLink } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { BodyText } from "../ui";

interface ProfileRowProps {
  link: ProfileLink;
  onPress: () => void;
  badge?: number;
}
const ProfileRow: FC<ProfileRowProps> = ({ link, onPress, badge = 0 }) => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between px-1 py-2"
      activeOpacity={0.8}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="items-center justify-center rounded-full w-9 h-9"
          style={{ backgroundColor: isDark ? "#111827" : "#F5F5F5" }}
        >
          <Ionicons name={link.icon} size={18} color={theme.iconMuted} />
        </View>
        <BodyText size="md" weight="medium" tone={theme.headingTone}>
          {link.label}
        </BodyText>
      </View>
      {badge > 0 && (
        <View className="items-center justify-center w-5 h-5 mr-2 bg-red-500 rounded-full">
          <BodyText size="xs" tone="inverse" weight="medium">
            {badge}
          </BodyText>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color={theme.iconMuted} />
    </TouchableOpacity>
  );
};

export default ProfileRow;
