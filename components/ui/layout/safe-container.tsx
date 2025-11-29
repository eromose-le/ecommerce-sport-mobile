import React from "react";
import {
  SafeAreaView,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";
import { useThemedStyles } from "@/providers/theme";
import { containerVariants, type ContainerVariants } from "./variants";

type SafeContainerProps = SafeAreaViewProps & ContainerVariants;

const SafeContainer: React.FC<SafeContainerProps> = ({
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
  const isThemedSurface =
    background === undefined ||
    background === "default" ||
    background === "surface" ||
    background === "muted";

  const surfaceClass =
    background === "muted"
      ? themed.mutedSurface
      : isThemedSurface
        ? themed.surface
        : "";

  const resolvedBackground: ContainerVariants["background"] = isThemedSurface
    ? "transparent"
    : background ?? "transparent";

  const mergedClassName = [surfaceClass, className].filter(Boolean).join(" ");

  return (
    <SafeAreaView
      className={containerVariants({
        padding,
        background: resolvedBackground,
        rounded,
        gap,
        border,
        fullHeight,
        className: mergedClassName,
      })}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeContainer;
