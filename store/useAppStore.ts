import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { CartItem } from "@/services/cart/cart.types";
import { User } from "@/services/user/user.types";

interface AppState {
  // global
  loading: boolean;
  setLoading: (v: boolean) => void;

  // user
  user: User | null;
  setUser: (u: User | null) => Promise<void>;

  skippedLogin: boolean;
  setSkippedLogin: (v: boolean) => Promise<void>;

  token: string | null;
  setToken: (t: string | null) => Promise<void>;

  // cart
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  loading: true,
  setLoading: (v) => set({ loading: v }),

  user: null,
  setUser: async (u) => {
    set({ user: u });
    if (u) {
      await SecureStore.setItemAsync("user", JSON.stringify(u));
    } else {
      await SecureStore.deleteItemAsync("user");
    }
  },

  token: null,
  setToken: async (t) => {
    set({ token: t });
    if (t) await SecureStore.setItemAsync("token", t);
    else await SecureStore.deleteItemAsync("token");
  },

  skippedLogin: false,
  setSkippedLogin: async (v) => {
    set({ skippedLogin: v });
    if (v) {
      await SecureStore.setItemAsync("skippedLogin", "true");
    } else {
      await SecureStore.deleteItemAsync("skippedLogin");
    }
  },

  cart: [],
  addToCart: (item) =>
    set((s) => ({
      cart: [...s.cart, item],
    })),

  removeFromCart: (id) =>
    set((s) => ({
      cart: s.cart.filter((c) => c.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));
