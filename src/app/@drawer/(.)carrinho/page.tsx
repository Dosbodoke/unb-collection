"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import EmptySpaceSvg from "@/assets/empty-space.svg";
import Image from "next/image";
import { Item } from "./_components/item";
import { useCartStore } from "@/stores/cart-store";

export default function Carrinho() {
  const { cart, deleteFromCart } = useCartStore();
  const total = cart.reduce(
    (acc, item) => acc + item.product_sku.price * item.quantity,
    0
  );
  const router = useRouter();

  return (
    <Drawer
      open={true}
      direction="right"
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DrawerContent className="bg-white flex flex-col rounded-tr-none rounded-l-[10px] h-full w-full max-w-80 md:max-w-96 mt-24 fixed bottom-0 right-0 left-auto">
        <DrawerHeader>
          <DrawerTitle>Seu carrinho</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {cart.length === 0 ? (
            <div className="gap-6 h-full w-full flex flex-col justify-center">
              <Image
                priority
                src={EmptySpaceSvg}
                alt="Ilustração para carrinho vazio"
              />
              <h2 className="text-center text-muted-foreground">
                Seu carrinho está vazio
              </h2>
            </div>
          ) : (
            <ul className="grid gap-6">
              {cart.map((item) => (
                <Item
                  item={item}
                  key={item.product_sku.id}
                  removeFromCart={deleteFromCart}
                />
              ))}
            </ul>
          )}
        </div>
        <DrawerFooter className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">total</p>
              <p className="font-medium">R${total.toFixed(2)}</p>
            </div>
            <Button size="lg">Comprar</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
