import React from "react";
import { Text, type TextProps } from "react-native";
import { headingVariants, type HeadingVariants } from "./variants";

type HeadingProps = TextProps & HeadingVariants & { children: React.ReactNode };

const Heading: React.FC<HeadingProps> = ({
  children,
  className,
  level,
  tone,
  align,
  weight,
  spacing,
  uppercase,
  ...rest
}) => {
  return (
    <Text
      className={headingVariants({
        level,
        tone,
        align,
        weight,
        spacing,
        uppercase,
        className,
      })}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default Heading;
