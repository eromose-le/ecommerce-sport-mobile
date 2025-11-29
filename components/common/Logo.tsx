import LogoIcon from "@/assets/icons/logo.svg";
import { useTheme } from "@/providers/theme";
import React, { FC } from "react";
import { SvgIcon } from "./SvgIcon";

interface LogoProps {
  size?: number;
}
const Logo: FC<LogoProps> = ({ size }) => {
  const { isDark } = useTheme();

  return (
    <SvgIcon
      Icon={LogoIcon}
      size={size ? size : 75}
      color={isDark ? "#fff" : "#000"}
    />
  );
};

export default Logo;
