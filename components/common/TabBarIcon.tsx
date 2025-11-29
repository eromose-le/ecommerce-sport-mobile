import { SvgIcon } from "@/components/common/SvgIcon";
import { useTheme } from "@/providers/theme";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

interface TabBarIconProps {
  Icon: React.FC<SvgProps>;
  label: string;
  focused: boolean;
  activeColor?: string;
  inactiveColor?: string;
  size?: number;
  badgeCount?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  Icon,
  label,
  focused,
  activeColor = "#000",
  inactiveColor = "#808080",
  size = 24,
  badgeCount = 0,
}) => {
  const { isDark } = useTheme();
  const resolvedActiveColor = isDark ? "#fff" : "#000";
  const resolvedInActiveColor = inactiveColor;

  const color = focused ? resolvedActiveColor : resolvedInActiveColor;
  const showBadge = badgeCount > 0;

  // Shared value for scale
  const scale = useSharedValue(showBadge ? 1 : 0);

  useEffect(() => {
    if (showBadge) {
      // Bounce sequence (premium UX)
      scale.value = withSequence(
        withTiming(0, { duration: 0 }), // reset instantly
        withTiming(1.25, { duration: 140 }), // pop
        withSpring(1, { damping: 8, stiffness: 150 }) // bounce back
      );
    } else {
      // Smooth fade + shrink when removing
      scale.value = withTiming(0, { duration: 180 });
    }
  }, [scale, showBadge]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <View className="flex items-center justify-center w-20">
      <SvgIcon Icon={Icon} size={size} color={color} />

      {/* BADGE */}
      {showBadge && (
        <Animated.View
          style={animatedStyle}
          className="absolute -top-1 right-0 min-w-[18px] h-[18px] bg-red-600 rounded-full items-center justify-center px-1"
        >
          <Text className="text-[10px] font-bold text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </Text>
        </Animated.View>
      )}

      <Text
        style={{
          color,
          fontSize: 11,
          marginTop: 4,
          fontWeight: focused ? "400" : "300",
        }}
      >
        {label}
      </Text>
    </View>
  );
};
