import React, { ReactNode } from "react";
import { Text, View } from "react-native";
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
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-2 bg-background ${className}`}
    >
      {/* Left: default BackButton, but can be overridden */}
      {left ?? <BackButton />}

      {/* Center title */}
      {title && (
        <Text
          className={`text-xl font-jost-medium text-primary ${titleClassName}`}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}

      {/* Right: custom element or fixed-width spacer */}
      {right ?? <View className="w-7" />}
    </View>
  );
};

export default AppHeader;
