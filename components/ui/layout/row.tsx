import React from "react";
import { View, type ViewProps } from "react-native";
import { useThemedStyles } from "@/providers/theme";
import { rowVariants, type RowVariants } from "./variants";

type RowProps = ViewProps & RowVariants;

const Row: React.FC<RowProps> = ({
  children,
  className,
  gap,
  justify,
  align,
  padding,
  rounded,
  background,
  wrap,
  ...rest
}) => {
  const themed = useThemedStyles();
  const surfaceClass =
    background === "muted"
      ? themed.mutedSurface
      : background === "surface"
        ? themed.surface
        : "";
  const mergedClassName = [surfaceClass, className].filter(Boolean).join(" ");
  return (
    <View
      className={rowVariants({
        gap,
        justify,
        align,
        padding,
        rounded,
        background,
        wrap,
        className: mergedClassName,
      })}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Row;
