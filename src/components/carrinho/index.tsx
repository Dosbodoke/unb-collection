'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useCartStore } from '@/stores/cart-store';

import { CartButton } from './_components/cart-button';
import { CartFooter } from './_components/cart-footer';
import { EmptyCart } from './_components/empty-cart';
import { Item } from './_components/item';
import { PayWithMercadoPago } from './_components/pay-with-mercado-pago';

export type OrderData = {
  orderId: string;
  items: {
    id: string;
    quantity: number;
    unit_price: number;
    description: string;
    title: string;
    imageUrl: string | null;
  }[];
  totalValue: number;
};

const slideAnimation = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 300, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export default function Carrinho() {
  const { cart, deleteFromCart, totalQuantity, setCartOpen, isCartOpen } = useCartStore();
  const cartIsEmpty = cart.length === 0;

  const [order, setOrder] = useState<null | OrderData>(null);

  return (
    <Drawer
      open={isCartOpen}
      onOpenChange={(open) => {
        if (!open && order) {
          setOrder(null);
        }
        setCartOpen(open);
      }}
      direction="right"
    >
      <DrawerTrigger asChild>
        <CartButton onClick={() => setCartOpen(true)} totalQuantity={totalQuantity} />
      </DrawerTrigger>
      <DrawerContent
        className="bg-white rounded-tr-none rounded-l-[10px] h-full w-full max-w-96  mt-24 fixed bottom-0 right-0 left-auto"
        aria-describedby={undefined}
      >
        <AnimatePresence initial={false} mode="wait">
          {order ? (
            <motion.div key="order-details" {...slideAnimation} className="h-full flex flex-col">
              <DrawerHeader>
                <DrawerTitle>Pedido #{order.orderId}</DrawerTitle>
                <div className="w-full h-px bg-muted shadow-sm" />
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto py-6">
                <ul className="grid gap-4 overflow-hidden">
                  {order.items.map((item) => (
                    <Item item={item} key={item.id} isOrdered={true} />
                  ))}
                </ul>
              </div>
              <DrawerFooter>
                <PayWithMercadoPago orderData={order} />
              </DrawerFooter>
            </motion.div>
          ) : (
            <motion.div key="cart-details" {...slideAnimation} className="h-full flex flex-col">
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
                        <Item
                          item={item}
                          key={item.product_sku.id}
                          removeFromCart={deleteFromCart}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
              <CartFooter setOrder={setOrder} />
            </motion.div>
          )}
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  );
}
