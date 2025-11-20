import { PROFILE } from "@/constants/urls";
import { useAuthUser } from "@/hooks/useAuthUser";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Logo from "./Logo";

const AppProtectedHeader = () => {
  const { user } = useAuthUser();

  const userName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Guest";

  return (
    <View className="flex-row items-center justify-between mb-2">
      <Logo />

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => router.push(PROFILE)}
          className="items-center justify-center bg-black rounded-full w-9 h-9"
        >
          <Text className="font-semibold text-white">{userName[0] ?? "U"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppProtectedHeader;
