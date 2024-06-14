"use client";

import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { useState, useEffect } from "react";

interface CartItem {
  quantity: number;
  product: Database["public"]["Tables"]["product"]["Row"];
}

const useCart = () => {
  const supabase = createClient();

  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from local storage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const deleteFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  return {
    cart,
    addToCart,
    deleteFromCart,
  };
};

export default useCart;
