import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Database } from '@/utils/supabase/database.types';

// Define the type for variants
export type Variant = Database['public']['Tables']['products_skus']['Row'] & {
  size: { value: string };
  color: { value: string };
  product: Database['public']['Tables']['product']['Row'];
};

export interface CartItem {
  quantity: number;
  product_sku: Variant;
}

interface CartState {
  cart: CartItem[];
  totalQuantity: number;
  totalValue: number;
  isCartOpen: boolean;
  addToCart: (sku: CartItem['product_sku']) => void;
  deleteFromCart: (productId: number) => void;
  setCartOpen: (isOpen: boolean) => void;
}

function calculateCartTotals(cart: CartItem[]) {
  return cart.reduce(
    (acc, item) => {
      acc.totalQuantity += item.quantity;
      acc.totalValue += item.product_sku.price * item.quantity;
      return acc;
    },
    { totalQuantity: 0, totalValue: 0 },
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      totalQuantity: 0,
      totalValue: 0,
      isCartOpen: false,
      addToCart: (sku) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex((item) => item.product_sku.id === sku.id);

          let updatedCart;
          if (existingItemIndex === -1) {
            updatedCart = [...state.cart, { quantity: 1, product_sku: sku }];
          } else {
            updatedCart = [...state.cart];
            const existingItem = updatedCart[existingItemIndex];
            if (existingItem) {
              updatedCart[existingItemIndex] = {
                ...existingItem,
                quantity: existingItem.quantity + 1,
              };
            }
          }

          const { totalQuantity, totalValue } = calculateCartTotals(updatedCart);
          return { cart: updatedCart, totalQuantity, totalValue, isCartOpen: true };
        }),
      deleteFromCart: (productId) =>
        set((state) => {
          const updatedCart = state.cart.filter((item) => item.product_sku.id !== productId);
          const { totalQuantity, totalValue } = calculateCartTotals(updatedCart);
          return { cart: updatedCart, totalQuantity, totalValue };
        }),
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'cart-storage',
    },
  ),
);
