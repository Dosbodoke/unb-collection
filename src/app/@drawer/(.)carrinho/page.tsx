'use client';

import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import EmptySpaceSvg from '@/assets/empty-space.svg';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useCartStore } from '@/stores/cart-store';

import { Item } from './_components/item';

export default function Carrinho() {
  const router = useRouter();
  const { cart, deleteFromCart, totalValue } = useCartStore();

  const cartIsEmpty = cart.length === 0;

  return (
    <Drawer
      open={true}
      direction="right"
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DrawerContent className="bg-white flex flex-col rounded-tr-none rounded-l-[10px] h-full w-full max-w-80 md:max-w-96 mt-24 fixed bottom-0 right-0 left-auto">
        <DrawerHeader>
          <DrawerTitle>Seu carrinho</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {cartIsEmpty ? (
            <div className="gap-6 h-full w-full flex flex-col justify-center">
              <Image priority src={EmptySpaceSvg} alt="Ilustração para carrinho vazio" />
              <h2 className="text-center text-muted-foreground">Seu carrinho está vazio</h2>
            </div>
          ) : (
            <ul className="grid gap-6 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <Item item={item} key={item.product_sku.id} removeFromCart={deleteFromCart} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
        <DrawerFooter className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">total</p>
              <p className="font-medium">R${totalValue.toFixed(2)}</p>
            </div>
            <Button size="lg" type="button" disabled={cartIsEmpty}>
              Finalizar compra
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
