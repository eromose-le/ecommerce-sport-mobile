import { tv, type VariantProps } from "tailwind-variants";

export const headingVariants = tv({
  base: "font-jost-semibold",
  variants: {
    level: {
      h1: "text-3xl",
      h2: "text-2xl",
      h3: "text-xl",
      h4: "text-lg",
    },
    tone: {
      primary: "text-primary",
      secondary: "text-secondary",
      inverse: "text-white",
      muted: "text-gray-500",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      regular: "font-jost",
      medium: "font-jost-medium",
      semibold: "font-jost-semibold",
      bold: "font-jost-bold",
    },
    spacing: {
      normal: "",
      tight: "tracking-tight",
      wide: "tracking-wide",
    },
    uppercase: {
      true: "uppercase",
    },
  },
  defaultVariants: {
    level: "h2",
    tone: "primary",
    align: "left",
    weight: "semibold",
    spacing: "normal",
  },
});

export const textVariants = tv({
  base: "font-jost",
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    tone: {
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-gray-500",
      inverse: "text-white",
      danger: "text-red-500",
      success: "text-green-600",
    },
    weight: {
      regular: "font-jost",
      medium: "font-jost-medium",
      semibold: "font-jost-semibold",
      bold: "font-jost-bold",
      light: "font-light",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    uppercase: {
      true: "uppercase tracking-wide",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "primary",
    weight: "regular",
    align: "left",
  },
});

export const labelVariants = tv({
  base: "text-xs font-jost text-secondary",
  variants: {
    tone: {
      primary: "text-primary",
      secondary: "text-secondary",
      inverse: "text-white",
      danger: "text-red-500",
      success: "text-green-600",
      muted: "text-gray-500",
    },
    weight: {
      regular: "font-jost",
      medium: "font-jost-medium",
      semibold: "font-jost-semibold",
    },
    uppercase: {
      true: "uppercase tracking-wide",
    },
  },
  defaultVariants: {
    tone: "secondary",
    weight: "medium",
  },
});

export type HeadingVariants = VariantProps<typeof headingVariants>;
export type TextVariants = VariantProps<typeof textVariants>;
export type LabelVariants = VariantProps<typeof labelVariants>;
