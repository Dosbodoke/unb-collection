'use client';

import { AnimatePresence } from 'framer-motion';
import { AlertTriangleIcon } from 'lucide-react';
import React from 'react';

import { PayWithMercadoPago } from '@/components/carrinho/_components/pay-with-mercado-pago';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/stores/cart-store';

import { CartButton } from './_components/cart-button';
import { EmptyCart } from './_components/empty-cart';
import { Item } from './_components/item';

export default function Carrinho() {
  const { cart, deleteFromCart, totalValue, totalQuantity, setCartOpen, isCartOpen } =
    useCartStore();

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
        {cartIsEmpty ? null : (
          <DrawerFooter className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <Alert className="border-none p-0">
              <AlertTitle className="flex items-end gap-1">
                <AlertTriangleIcon className="size-5 text-yellow-500" />{' '}
                <span>Sobre a entrega</span>
              </AlertTitle>
              <AlertDescription>
                O seu pedido deverá ser retirado pessoalmente na Universidade de Brasília - Campus
                Darcy Ribeiro
              </AlertDescription>
              <Textarea
                placeholder="Adicione uma nota ao seu pedido"
                className="resize-none mt-2"
              />
            </Alert>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">total</p>
                <p className="font-medium">R${totalValue.toFixed(2)}</p>
              </div>
              <PayWithMercadoPago />
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
