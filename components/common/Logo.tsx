import LogoIcon from "@/assets/icons/logo.svg";
import React, { FC } from "react";
import { SvgIcon } from "./SvgIcon";

interface LogoProps {
  size?: number;
}
const Logo: FC<LogoProps> = ({ size }) => {
  return <SvgIcon Icon={LogoIcon} size={size ? size : 75} />;
};

export default Logo;
