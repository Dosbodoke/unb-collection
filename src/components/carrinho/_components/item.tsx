import { motion } from 'framer-motion';
import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import type { CartItem } from '@/stores/cart-store';
import { createClient } from '@/utils/supabase/client';

import { OrderData } from '..';

interface ItemProps {
  item: CartItem | OrderData['items'][0];
  removeFromCart?: (id: number) => void;
  isOrdered?: boolean;
}

const Item = forwardRef<HTMLLIElement, ItemProps>(({ item, removeFromCart, isOrdered }, ref) => {
  const supabase = createClient();

  const isCartItem = (item: CartItem | OrderData['items'][0]): item is CartItem => {
    return 'product_sku' in item;
  };

  const getImageUrl = () => {
    if (isCartItem(item)) {
      return item.product_sku.product.cover
        ? supabase.storage.from('products').getPublicUrl(item.product_sku.product.cover).data
            .publicUrl
        : null;
    }

    return item.imageUrl;
  };

  const name = isCartItem(item) ? item.product_sku.product.name : item.title;
  const price = isCartItem(item) ? item.product_sku.price : item.unit_price;
  const id = isCartItem(item) ? item.product_sku.id : parseInt(item.id);
  const imageUrl = getImageUrl();

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="hover:bg-muted px-4 py-2"
    >
      <Link
        href={isCartItem(item) ? `/product/${item.product_sku.product.slug}` : '#'}
        className="flex flex-row gap-4"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={80}
            height={80}
            className="rounded-md object-cover overflow-hidden"
          />
        ) : (
          <div style={{ width: 80, height: 80 }} className="bg-muted rounded-md" />
        )}
        <div className="flex-1 flex flex-col gap-1">
          <h3 className="font-medium">{name}</h3>
          <div>
            {item.quantity !== 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                R${price.toFixed(2)} x {item.quantity}
              </p>
            )}
            <p className="font-medium">${(price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
        {!isOrdered && (
          <div className="flex flex-col justify-start">
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                if (removeFromCart) removeFromCart(id);
              }}
            >
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Remove {name}</span>
            </Button>
          </div>
        )}
      </Link>
    </motion.li>
  );
});

Item.displayName = 'Item';

export { Item };
