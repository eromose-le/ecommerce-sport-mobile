import React from "react";
import { View, type ViewProps } from "react-native";
import { containerVariants, type ContainerVariants } from "./variants";

type ContainerProps = ViewProps & ContainerVariants;

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  padding,
  background,
  rounded,
  gap,
  border,
  fullHeight,
  ...rest
}) => {
  return (
    <View
      className={containerVariants({
        padding,
        background,
        rounded,
        gap,
        border,
        fullHeight,
        className,
      })}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Container;
