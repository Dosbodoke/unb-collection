'use client';

import { AnimatePresence } from 'framer-motion';
import React from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useCartStore } from '@/stores/cart-store';

import { CartButton } from './_components/cart-button';
import { DrawerFooter } from './_components/drawer-footer';
import { EmptyCart } from './_components/empty-cart';
import { Item } from './_components/item';

export default function Carrinho() {
  const { cart, deleteFromCart, totalQuantity, setCartOpen, isCartOpen } = useCartStore();

  const cartIsEmpty = cart.length === 0;

  return (
    <Drawer open={isCartOpen} onOpenChange={setCartOpen} direction="right">
      <DrawerTrigger asChild>
        <CartButton onClick={() => setCartOpen(true)} totalQuantity={totalQuantity} />
      </DrawerTrigger>
      <DrawerContent
        className="bg-white flex flex-col rounded-tr-none rounded-l-[10px] h-full w-full max-w-96  mt-24 fixed bottom-0 right-0 left-auto"
        aria-describedby={undefined}
      >
        <DrawerHeader>
          <DrawerTitle>Seu carrinho</DrawerTitle>
          <div className="w-full h-px bg-muted shadow-sm" />
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto py-6">
          {cartIsEmpty ? (
            <EmptyCart />
          ) : (
            <ul className="grid gap-4 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <Item item={item} key={item.product_sku.id} removeFromCart={deleteFromCart} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
        {cartIsEmpty ? null : <DrawerFooter />}
      </DrawerContent>
    </Drawer>
  );
}
