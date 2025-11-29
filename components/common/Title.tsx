import { useThemedStyles } from "@/providers/theme";
import React from "react";
import { View, ViewStyle } from "react-native";
import { Heading, LinkButton } from "../ui";

interface TitleProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Title: React.FC<TitleProps> = ({
  title,
  actionText,
  onActionPress,
  containerStyle,
}) => {
  const theme = useThemedStyles();
  return (
    <View
      className="flex-row items-center justify-between mb-5"
      style={containerStyle}
    >
      <Heading level="h3" align="center" weight="medium">
        {title}
      </Heading>

      {actionText && (
        <LinkButton
          size="lg"
          title={actionText}
          onPress={() => onActionPress?.()}
          textClassName={theme.linkTextClass}
          spinnerColor={theme.linkSpinnerColor}
        />
      )}
    </View>
  );
};
