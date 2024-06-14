"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import useCart from "@/hooks/use-cart";
import EmptySpaceSvg from "@/assets/empty-space.svg";
import Image from "next/image";

export default function Carrinho() {
  const { cart, deleteFromCart } = useCart();
  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
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
                <li
                  key={item.product.id}
                  className="grid grid-cols-[80px_1fr_80px] items-center gap-4"
                >
                  <img
                    src="/placeholder.svg"
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="grid gap-1 items-center">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      R${item.product.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-right font-medium">
                      R${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteFromCart(item.product.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">
                        Remove {item.product.name}
                      </span>
                    </Button>
                  </div>
                </li>
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
