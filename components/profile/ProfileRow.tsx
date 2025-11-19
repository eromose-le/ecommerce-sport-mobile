import { ProfileLink } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileRowProps {
  link: ProfileLink;
  onPress: () => void;
  badge?: number;
}
const ProfileRow: FC<ProfileRowProps> = ({ link, onPress, badge = 0 }) => {
  return (
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
          <Text className="text-[10px] text-white font-jost-medium">
            {badge}
          </Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default ProfileRow;
