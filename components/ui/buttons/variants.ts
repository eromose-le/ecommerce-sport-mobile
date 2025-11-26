import { tv, type VariantProps } from "tailwind-variants";

/**
 * Shared button container styles.
 * - Mirrors the black primary + outlined secondary buttons used across auth/product flows.
 * - Keep padding adjustable so buttons can be reused inside rows or full-width layouts.
 */
export const buttonContainerVariants = tv({
  base: "rounded-2xl py-3 max-h-[50px] flex-row items-center justify-center",
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "border border-primary bg-transparent",
      ghost: "bg-transparent border border-transparent",
      link: "bg-transparent border border-transparent p-0 py-0 px-0 h-auto max-h-none rounded-none",
    },
    size: {
      none: "px-0 py-0 h-auto max-h-none min-h-0",
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-5 py-3.5",
    },
    align: {
      start: "justify-start",
      center: "justify-center",
      between: "justify-between",
    },
    fullWidth: {
      true: "w-full",
    },
    disabled: {
      true: "opacity-60",
    },
  },
  compoundVariants: [
    {
      variant: "secondary",
      disabled: true,
      class: "border-[#bcbcbd]",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    align: "center",
  },
});

/**
 * Text styling paired with the button container variants.
 */
export const buttonLabelVariants = tv({
  base: "font-jost-medium text-center",
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    uppercase: {
      true: "uppercase tracking-wide",
    },
    variant: {
      primary: "text-white",
      secondary: "text-primary",
      ghost: "text-primary",
      link: "text-primary underline",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export type ButtonContainerVariants = VariantProps<typeof buttonContainerVariants>;
export type ButtonLabelVariants = VariantProps<typeof buttonLabelVariants>;
