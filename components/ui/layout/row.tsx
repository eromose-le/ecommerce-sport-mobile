import React from "react";
import { View, type ViewProps } from "react-native";
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
        className,
      })}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Row;
