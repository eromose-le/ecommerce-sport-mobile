import React from "react";
import { View, type ViewProps } from "react-native";
import { useThemedStyles } from "@/providers/theme";
import { cardVariants, type CardVariants } from "./variants";

type CardProps = ViewProps & CardVariants;

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding,
  shadow,
  fullWidth,
  ...rest
}) => {
  const themed = useThemedStyles();
  return (
    <View
      className={cardVariants({
        padding,
        shadow,
        fullWidth,
        className: [themed.surface, className].filter(Boolean).join(" "),
      })}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Card;
