import ScrollableForm from "@/components/common/ScrollableForm";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { BodyText } from "@/components/ui";
import { useThemedStyles, useTheme } from "@/providers/theme";

const PaymentMethods = () => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  return (
    <ScrollableForm>
      <BodyText size="md" tone={theme.bodyTone} className="mb-6">
        Manage your saved payment methods. Support for in-app payment management
        is coming soon.
      </BodyText>
      <View
        className="items-center p-6 border border-dashed rounded-2xl"
        style={{ borderColor: isDark ? "#374151" : "#9CA3AF" }}
      >
        <Ionicons name="card-outline" size={36} color={theme.iconMuted} />
        <BodyText
          size="md"
          weight="medium"
          tone={theme.labelTone}
          className="mt-3"
        >
          No saved cards yet
        </BodyText>
        <BodyText
          size="xs"
          align="center"
          tone={theme.labelTone}
          className="mt-1"
        >
          Our team is working on secure card storage so you can checkout even
          faster.
        </BodyText>
      </View>
    </ScrollableForm>
  );
};

export default PaymentMethods;
