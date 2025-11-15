import DirectLeftIcon from "@/assets/icons/direct-left.svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { SvgIcon } from "./SvgIcon";

interface BackButtonProps {
  /**
   * Optional custom handler
   * If not provided, automatically router.back()
   */
  onPress?: () => void;

  /**
   * Icon size (default: 22)
   */
  size?: number;

  /**
   * Icon color (default: #000)
   */
  color?: string;

  /**
   * Background variant
   * - "light" (gray-100)
   * - "dark" (black w/ opacity)
   * - "none" (transparent)
   */
  variant?: "light" | "dark" | "none";

  /**
   * Tailwind + inline styles
   */
  className?: string;
  style?: ViewStyle;

  /**
   * Icon override
   */
  icon?: keyof typeof Ionicons.glyphMap;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  size = 24,
  color = "#000",
  variant = "light",
  className = "",
  style,
  icon,
}) => {
  const router = useRouter();

  const background =
    variant === "light"
      ? "bg-transparent border border-[#0000001A]"
      : variant === "dark"
        ? "bg-black/20"
        : "bg-transparent";

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      className={`p-3 rounded-full ${background} ${className}`}
      style={style}
      activeOpacity={0.8}
    >
      {icon ? (
        <Ionicons name={icon} size={size} color={color} />
      ) : (
        <SvgIcon Icon={DirectLeftIcon} size={size} color={color} />
      )}
    </TouchableOpacity>
  );
};
