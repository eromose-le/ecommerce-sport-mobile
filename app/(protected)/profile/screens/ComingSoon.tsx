import ScrollableForm from "@/components/common/ScrollableForm";
import { BodyText } from "@/components/ui";
import { useThemedStyles } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

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

const EmptyState = ({ message, icon }: { message: string; icon: any }) => {
  const theme = useThemedStyles();
  return (
    <View className="items-center justify-center py-20">
      <Ionicons name={icon} size={40} color={theme.iconMuted} />
      <BodyText size="sm" tone={theme.labelTone} className="mt-4">
        {message}
      </BodyText>
    </View>
  );
};
