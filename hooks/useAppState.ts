import { useAppStore } from "@/store/useAppStore";

export const useAppState = () => {
  return useAppStore();
};

// USAGE
// const { cart, addToCart } = useAppState();
