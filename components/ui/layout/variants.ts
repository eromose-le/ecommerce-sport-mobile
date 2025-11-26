import { tv, type VariantProps } from "tailwind-variants";

export const containerVariants = tv({
  base: "w-full",
  variants: {
    padding: {
      none: "",
      sm: "px-3 py-3",
      md: "px-5 py-4",
      lg: "px-6 py-5",
    },
    background: {
      transparent: "bg-transparent",
      default: "bg-background",
      surface: "bg-white",
      muted: "bg-light-100",
    },
    rounded: {
      none: "",
      md: "rounded-xl",
      lg: "rounded-2xl",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
    border: {
      none: "",
      subtle: "border border-[#0000001A]",
      strong: "border border-black",
    },
    fullHeight: {
      true: "flex-1",
    },
  },
  defaultVariants: {
    padding: "none",
    background: "transparent",
    gap: "none",
    rounded: "none",
    border: "none",
  },
});

export const cardVariants = tv({
  base: "bg-white rounded-2xl border border-[#0000001A]",
  variants: {
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
    shadow: {
      none: "",
      sm: "shadow-sm shadow-black/5",
      md: "shadow-md shadow-black/10",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    padding: "md",
    shadow: "none",
  },
});

export const rowVariants = tv({
  base: "flex-row items-center",
  variants: {
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
    padding: {
      none: "",
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
    },
    rounded: {
      none: "",
      sm: "rounded-lg",
      md: "rounded-xl",
      lg: "rounded-2xl",
    },
    background: {
      transparent: "bg-transparent",
      surface: "bg-white",
      muted: "bg-light-100",
    },
    wrap: {
      true: "flex-wrap",
    },
  },
  defaultVariants: {
    gap: "md",
    justify: "start",
    align: "center",
    padding: "none",
    rounded: "none",
    background: "transparent",
  },
});

export type ContainerVariants = VariantProps<typeof containerVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type RowVariants = VariantProps<typeof rowVariants>;
