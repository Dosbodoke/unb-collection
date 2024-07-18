'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
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
      <DrawerContent className="bg-white flex flex-col rounded-tr-none rounded-l-[10px] h-full w-full max-w-96  mt-24 fixed bottom-0 right-0 left-auto">
        <DrawerHeader>
          <DrawerTitle>Seu carrinho</DrawerTitle>
          <div className="w-full h-px bg-muted shadow-sm" />
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto py-6">
          {cartIsEmpty ? (
            <div className="gap-4 h-full w-full flex flex-col justify-center px-4 ">
              <Image
                priority
                width={256}
                height={256}
                src="/empty-shopping-bag.webp"
                alt="Ilustração para sacola vazio"
                className="mx-auto"
              />
              <div className="flex items-center flex-col">
                <h2 className="text-center text-xl text-muted-foreground">
                  Seu carrinho está vazio
                </h2>
                <Button className="text-center" variant="link" asChild>
                  <Link href="/products">Explorar produtos</Link>
                </Button>
              </div>
            </div>
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
              <motion.div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">total</p>
                <p className="font-medium">R${totalValue.toFixed(2)}</p>
              </motion.div>
              <Button size="lg" type="button">
                Finalizar compra
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
