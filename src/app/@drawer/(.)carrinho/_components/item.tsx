"use client";

import { Trash2Icon } from "lucide-react";
import { motion } from "framer-motion";

import type { CartItem } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface ItemProps {
  item: CartItem;
  removeFromCart: (id: number) => void;
}

const Item = ({ item, removeFromCart }: ItemProps) => {
  const supabase = createClient();

  return (
    <motion.li
      key={item.product_sku.id}
      layout
      initial={{ opacity: 0, x: -200, scale: 0.5 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 200, scale: 1.2 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <Link
        href={`/product/${item.product_sku.product.slug}`}
        className="flex flex-row gap-4"
      >
        {item.product_sku.product.cover ? (
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
        ) : null}
        <div className="flex-1 flex flex-col gap-1">
          <h3 className="font-medium">{item.product_sku.product.name}</h3>
          <div>
            {item.quantity !== 1 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                R${item.product_sku.price.toFixed(2)} x {item.quantity}
              </p>
            ) : null}
            <p className="font-medium">
              ${(item.product_sku.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
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
      </Link>
    </motion.li>
  );
};

export { Item };
