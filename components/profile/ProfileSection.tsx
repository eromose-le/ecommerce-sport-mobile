import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { View } from "react-native";
import { useThemedStyles } from "@/providers/theme";
import { BodyText } from "../ui";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}
const ProfileSection: FC<ProfileSectionProps> = ({ title, children }) => {
  const theme = useThemedStyles();
  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Ionicons
            name={
              title === "Settings"
                ? "settings-outline"
                : "information-circle-outline"
            }
            size={18}
            color={theme.iconMuted}
          />
          <BodyText size="md" weight="bold" tone={theme.headingTone}>
            {title}
          </BodyText>
        </View>
      </View>
      <View className="gap-3">{children}</View>
    </>
  );
};

export default ProfileSection;
