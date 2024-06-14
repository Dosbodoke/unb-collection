"use client";

import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import useCart from "@/hooks/use-cart";

const CartButton = () => {
  const { cart } = useCart();

  return (
    <Button asChild variant="link" className="relative">
      <Link href="/carrinho">
        <ShoppingBagIcon className="h-6 w-6" />
        <Badge className="absolute -top-2 -right-1 rounded-full bg-primary text-xs text-white">
          {cart.length}
        </Badge>
      </Link>
    </Button>
  );
};

export { CartButton };
