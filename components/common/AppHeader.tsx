import { useThemedStyles } from "@/providers/theme";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { Heading } from "../ui";
import { BackButton } from "./BackButton";

type AppHeaderProps = {
  title: string;
  /** Optional right-side element (e.g. <CartButton />). If not provided, a spacer is rendered. */
  right?: ReactNode;
  /** Extra classes for the container */
  className?: string;
  /** Extra classes for the title */
  titleClassName?: string;
  /** If you ever want to hide/replace the back button */
  left?: ReactNode;
};

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  right,
  className = "",
  titleClassName = "",
  left,
}) => {
  const theme = useThemedStyles();
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-2 ${theme.pageBg} ${className}`}
    >
      {/* Left: default BackButton, but can be overridden */}
      {left ?? <BackButton />}

      {/* Center title */}
      {title && (
        <Heading level="h3" weight="medium" numberOfLines={1}>
          {title}
        </Heading>
      )}

      {/* Right: custom element or fixed-width spacer */}
      {right ?? <View className="w-7" />}
    </View>
  );
};

export default AppHeader;
