"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CartButton = () => {
  const cart = useCartStore((state) => state.cart);
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Button asChild variant="link" className="relative">
      <Link href="/carrinho">
        <ShoppingBagIcon className="h-6 w-6" />
        <AnimatePresence mode="wait">
          <Badge className="absolute -top-2 -right-1 rounded-full bg-primary text-xs text-white">
            <motion.div
              key={`${totalQuantity}-items`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="tabular-nums"
            >
              {totalQuantity}
            </motion.div>
          </Badge>
        </AnimatePresence>
      </Link>
    </Button>
  );
};

export { CartButton };
