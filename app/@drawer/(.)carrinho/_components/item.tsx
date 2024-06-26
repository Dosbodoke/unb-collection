"use client";

import { PlusIcon, MinusIcon, Trash2Icon } from "lucide-react";

import type { CartItem } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

const CartList = () => {};

interface ItemProps {
  item: CartItem;
  removeFromCart: (id: number) => void;
}

const Item = ({ item, removeFromCart }: ItemProps) => {
  const supabase = createClient();

  return (
    <li className="flex flex-row gap-4">
      <img
        src={
          supabase.storage
            .from("products")
            .getPublicUrl(item.product_sku.product.cover).data.publicUrl
        }
        alt={item.product_sku.product.name}
        width={80}
        height={80}
        className="rounded-md object-cover"
      />
      <div className="items-center flex-1">
        <h3 className="font-medium">{item.product_sku.product.name}</h3>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="text-right font-medium">
          ${(item.product_sku.price * item.quantity).toFixed(2)}
        </p>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => removeFromCart(item.product_sku.id)}
        >
          <Trash2Icon className="h-4 w-4" />
          <span className="sr-only">
            Remove {item.product_sku.product.name}
          </span>
        </Button>
      </div>
    </li>
  );
};

export { Item };
