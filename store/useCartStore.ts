import { getEffectivePrice } from "@/helpers/product-discount";
import { CartItem, CartItemInput, CartState } from "@/services/cart/cart.types";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const secureStoreStorage: StateStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

const normalizeItem = (item: CartItemInput): CartItem => {
  const qty = item?.variant?.qty ?? 1;
  const price = getEffectivePrice(
    item?.variant?.price ?? item?.price,
    item?.variant?.salesPrice ?? item?.salesPrice
  );

  return {
    ...item,
    variant: {
      colorsPrice: 0,
      dimensionsPrice: 0,
      sizesPrice: 0,
      weightsPrice: 0,
      qty: qty > 0 ? qty : 1,
      ...item.variant,
      price,
    },
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (incomingItem, isSubmit) =>
        set((state) => {
          if (!incomingItem?.id) return state;
          const existing = state.cart.find(
            (item) => String(item.id) === String(incomingItem.id)
          );

          if (existing) {
            const incomingQty = incomingItem?.variant?.qty ?? 1;
            const nextQty = isSubmit
              ? existing.variant?.qty || 1
              : (existing.variant?.qty || 1) + incomingQty;

            const merged: CartItem = {
              ...existing,
              ...incomingItem,
              variant: {
                ...existing.variant,
                ...incomingItem.variant,
                qty: nextQty > 0 ? nextQty : existing.variant?.qty || 1,
                price: getEffectivePrice(
                  incomingItem?.variant?.price ?? existing.variant?.price,
                  incomingItem?.variant?.salesPrice ??
                    existing.variant?.salesPrice
                ),
              },
            };

            return {
              cart: state.cart.map((item) =>
                String(item.id) === String(incomingItem.id) ? merged : item
              ),
            };
          }

          const normalized = normalizeItem(incomingItem);
          return { cart: [...state.cart, normalized] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => String(item.id) !== String(id)),
        })),

      incrementQty: (id) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (String(item.id) !== String(id)) return item;
            return {
              ...item,
              variant: {
                ...item.variant,
                qty: (item.variant?.qty || 1) + 1,
              },
            };
          }),
        })),

      decrementQty: (id) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (String(item.id) !== String(id)) return item;
            const nextQty = Math.max(1, (item.variant?.qty || 1) - 1);
            return {
              ...item,
              variant: {
                ...item.variant,
                qty: nextQty,
              },
            };
          }),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => secureStoreStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
