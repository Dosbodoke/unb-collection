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
import { useState } from "react";

export default function Carrinho() {
  const [cart, setCart] = useState([
    {
      id: 1,
      image: "/placeholder.svg",
      name: "Cozy Blanket",
      price: 29.99,
      quantity: 1,
    },
    {
      id: 2,
      image: "/placeholder.svg",
      name: "Autumn Mug",
      price: 12.99,
      quantity: 2,
    },
    {
      id: 3,
      image: "/placeholder.svg",
      name: "Fall Fragrance Candle",
      price: 16.99,
      quantity: 1,
    },
  ]);
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
          <DrawerTitle>Your Cart</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="grid gap-6">
            {cart.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[80px_1fr_80px] items-center gap-4"
              >
                <img
                  src="/placeholder.svg"
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="grid gap-1 items-center">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    R${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-right font-medium">
                    R${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Remove {item.name}</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <DrawerFooter className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
              <p className="font-medium">R${total.toFixed(2)}</p>
            </div>
            <Button size="lg">Comprar</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
