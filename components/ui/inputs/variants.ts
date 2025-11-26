import { tv, type VariantProps } from "tailwind-variants";

export const inputWrapperVariants = tv({
  base: "w-full",
  variants: {
    spacing: {
      none: "gap-0",
      sm: "gap-1.5",
      md: "gap-2",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

export const inputLabelVariants = tv({
  base: "text-sm font-jost-medium text-primary",
  variants: {
    tone: {
      primary: "text-primary",
      secondary: "text-secondary",
      inverse: "text-white",
    },
    uppercase: {
      true: "uppercase tracking-wide",
    },
  },
  defaultVariants: {
    tone: "primary",
  },
});

export const inputFieldVariants = tv({
  base: "rounded-2xl border bg-white text-primary font-jost px-4 py-4",
  variants: {
    state: {
      default: "border-gray-200",
      focused: "border-black",
      error: "border-red-500",
      disabled: "border-gray-200 bg-light-100 text-secondary",
    },
    size: {
      sm: "py-3 text-sm",
      md: "py-4 text-base",
      lg: "py-5 text-base",
    },
    multiline: {
      true: "min-h-[90px] text-base",
      false: "",
    },
    hasLeft: {
      true: "pl-10",
      false: "",
    },
    hasRight: {
      true: "pr-10",
      false: "",
    },
    rounded: {
      md: "rounded-xl",
      lg: "rounded-2xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    state: "default",
    size: "md",
    rounded: "lg",
  },
});

export const inputHelperVariants = tv({
  base: "mt-1 text-xs font-jost",
  variants: {
    tone: {
      default: "text-secondary",
      error: "text-red-500",
      success: "text-green-600",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export type InputWrapperVariants = VariantProps<typeof inputWrapperVariants>;
export type InputLabelVariants = VariantProps<typeof inputLabelVariants>;
export type InputFieldVariants = VariantProps<typeof inputFieldVariants>;
export type InputHelperVariants = VariantProps<typeof inputHelperVariants>;
