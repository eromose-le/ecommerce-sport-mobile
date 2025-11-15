import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

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
  return (
    <View
      className="flex-row items-center justify-between mb-5"
      style={containerStyle}
    >
      <Text className="text-xl text-primary font-jost-medium">{title}</Text>

      {actionText && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onActionPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-lg text-secondary font-jost-medium">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
