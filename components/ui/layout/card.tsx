import React from "react";
import { View, type ViewProps } from "react-native";
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
  return (
    <View
      className={cardVariants({ padding, shadow, fullWidth, className })}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Card;
