'use client';

import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DrawerFooter as DrawerFooterPrimitive } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { CartItem, useCartStore } from '@/stores/cart-store';
import { createClient } from '@/utils/supabase/client';

import { PayWithMercadoPago } from './pay-with-mercado-pago';

export type OrderData = {
  orderId: string;
  items: {
    id: string;
    quantity: number;
    unit_price: number;
    description: string;
    title: string;
  }[];
};

export function DrawerFooter() {
  const { totalValue, cart } = useCartStore();
  const router = useRouter();
  const supabase = createClient();
  const [order, setOrder] = useState<null | OrderData>(null);

  const createOrder = useMutation({
    mutationFn: async (cart: CartItem[]) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // User mut be logged in
      if (!user) {
        router.push('/login');
        return;
      }

      // Create `order_details` and `order_items` instances
      const { data: items, error } = await supabase.rpc('create_order', {
        user_id: user.id,
        items_list: cart.map((item) => ({ id: item.product_sku.id, quantity: item.quantity })),
      });

      if (!items || items.length === 0 || error) {
        console.log({ error });
        return;
      }

      const { data: variants, error: variantError } = await supabase
        .from('products_skus')
        .select(
          `*,
        size:product_attributes!products_skus_size_attribute_id_fkey(value),
        color:product_attributes!products_skus_color_attribute_id_fkey(value),
        product:product!products_skus_product_id_fkey(*)
      `,
        )
        .in(
          'id',
          items.map((item) => item.product_id),
        );

      if (variantError || !variants) {
        console.error('Error fetching variants:', variantError);
        throw new Error('Failed to fetch product details');
      }

      // Verify and construct order data
      const verifiedItems = items.map((item) => {
        const variant = variants.find((v) => v.id === item.product_id);
        if (!variant) {
          throw new Error(`Product variant not found for item ${item.id}`);
        }

        const quantity = Number(item.quantity);
        const price = Number(variant.price);

        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Invalid quantity for item ${item.id}`);
        }
        if (isNaN(price) || price < 0) {
          throw new Error(`Invalid price for item ${item.id}`);
        }

        return {
          id: String(item.id), // Convert to string to match OrderData type
          quantity: quantity,
          unit_price: price,
          description: `${variant.product?.name || ''} - ${variant.size?.value || ''}, ${variant.color?.value || ''}`,
          title: variant.product?.name || '',
        };
      });

      const orderData: OrderData = {
        orderId: String(items[0]?.order_id) || '', // Convert to string and use empty string as fallback
        items: verifiedItems,
      };

      // Verify total value
      const calculatedTotal = verifiedItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0,
      );
      if (Math.abs(calculatedTotal - totalValue) > 0.01) {
        // Allow for small floating-point discrepancies
        throw new Error('Order total mismatch');
      }

      setOrder(orderData);
    },
  });

  return (
    <DrawerFooterPrimitive className="border-t border-gray-200 dark:border-gray-800">
      <AnimatePresence initial={false}>
        {order ? (
          <motion.div
            initial={{ x: 25, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -25, opacity: 0 }}
            key="pay-with-mercado-pago"
          >
            <PayWithMercadoPago orderData={order} />
          </motion.div>
        ) : (
          <motion.div
            key="continue-to-payment"
            initial={{ x: 25, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -25, opacity: 0 }}
            className="flex flex-col gap-4 w-full"
          >
            <div className="gap-2 flex flex-col">
              <Alert className="border-none p-0">
                <AlertTitle className="flex items-end gap-1">
                  <AlertTriangleIcon className="size-5 text-yellow-500" />{' '}
                  <span>Sobre a entrega</span>
                </AlertTitle>
                <AlertDescription>
                  O seu pedido deverá ser retirado pessoalmente na Universidade de Brasília - Campus
                  Darcy Ribeiro
                </AlertDescription>
              </Alert>
              <Textarea
                placeholder="Adicione uma nota ao seu pedido"
                className="resize-none mt-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">total</p>
              <p className="font-medium">R${totalValue.toFixed(2)}</p>
            </div>
            <Button
              onClick={async () => {
                await createOrder.mutateAsync(cart);
              }}
            >
              Continuar para pagamento
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </DrawerFooterPrimitive>
  );
}
