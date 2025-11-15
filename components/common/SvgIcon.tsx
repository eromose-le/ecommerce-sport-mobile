import React from "react";
import { SvgProps } from "react-native-svg";

interface SvgIconProps extends SvgProps {
  Icon: React.FC<SvgProps>;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export const SvgIcon: React.FC<SvgIconProps> = ({
  Icon,
  size = 24,
  color = "#000",
  ...props
}) => <Icon width={size} height={size} color={color} {...props} />;
