import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Text, View } from "react-native";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}
const ProfileSection: FC<ProfileSectionProps> = ({ title, children }) => {
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
          />
          <Text className="text-lg font-jost-bold text-primary">{title}</Text>
        </View>
      </View>
      <View className="gap-3">{children}</View>
    </>
  );
};

export default ProfileSection;
