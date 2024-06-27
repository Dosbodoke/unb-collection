import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Database } from "@/utils/supabase/database.types";

// Define the type for variants
export type Variant = Database["public"]["Tables"]["products_skus"]["Row"] & {
  size: { value: string };
  color: { value: string };
  product: Database["public"]["Tables"]["product"]["Row"];
};

export interface CartItem {
  quantity: number;
  product_sku: Variant;
}

interface CartState {
  cart: CartItem[];
  addToCart: (sku: CartItem["product_sku"]) => void;
  deleteFromCart: (productId: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (sku) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) => item.product_sku.id === sku.id
          );

          if (existingItemIndex === -1) {
            return { cart: [...state.cart, { quantity: 1, product_sku: sku }] };
          }

          const updatedCart = [...state.cart];
          const existingItem = updatedCart[existingItemIndex];
          if (existingItem) {
            updatedCart[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + 1,
            };
          }
          return { cart: updatedCart };
        }),
      deleteFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product_sku.id !== productId),
        })),
    }),
    {
      name: "cart-storage", // name of the item in the storage (must be unique)
    }
  )
);
