import ScrollableForm from "@/components/common/ScrollableForm";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const ComingSoon = () => {
  return (
    <ScrollableForm>
      <EmptyState
        message="This screen will be available soon."
        icon="hourglass-outline"
      />
    </ScrollableForm>
  );
};

export default ComingSoon;

const EmptyState = ({ message, icon }: { message: string; icon: any }) => (
  <View className="items-center justify-center py-20">
    <Ionicons name={icon} size={40} color="#D1D5DB" />
    <Text className="mt-4 text-sm text-secondary">{message}</Text>
  </View>
);
