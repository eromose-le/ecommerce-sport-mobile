import React from "react";
import { View, type ViewProps } from "react-native";
import { useThemedStyles } from "@/providers/theme";
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
  const themed = useThemedStyles();
  const surfaceClass =
    background === "muted"
      ? themed.mutedSurface
      : background === "surface" || background === "default"
        ? themed.surface
        : "";
  const mergedClassName = [surfaceClass, className].filter(Boolean).join(" ");
  return (
    <View
      className={containerVariants({
        padding,
        background,
        rounded,
        gap,
        border,
        fullHeight,
        className: mergedClassName,
      })}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Container;
