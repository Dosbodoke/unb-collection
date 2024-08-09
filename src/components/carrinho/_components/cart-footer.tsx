'use client';

import { useMutation } from '@tanstack/react-query';
import { AlertTriangleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DrawerFooter } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { type CartItem, useCartStore } from '@/stores/cart-store';
import { createClient } from '@/utils/supabase/client';

import type { OrderData } from '../index';

export function CartFooter({
  setOrder,
}: {
  setOrder: React.Dispatch<React.SetStateAction<OrderData | null>>;
}) {
  const { totalValue, cart, wipeCart } = useCartStore();
  const cartIsEmpty = cart.length === 0;

  const router = useRouter();
  const supabase = createClient();

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
          imageUrl:
            variant.product && variant.product.cover
              ? supabase.storage.from('products').getPublicUrl(variant.product.cover).data.publicUrl
              : null,
        };
      });

      // Verify total value
      const calculatedTotal = verifiedItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0,
      );
      if (Math.abs(calculatedTotal - totalValue) > 0.01) {
        // Allow for small floating-point discrepancies
        throw new Error('Order total mismatch');
      }

      const orderData: OrderData = {
        orderId: String(items[0]?.order_id) || '',
        items: verifiedItems,
        totalValue: calculatedTotal,
      };

      wipeCart();
      setOrder(orderData);
    },
  });

  if (cartIsEmpty) return null;

  return (
    <DrawerFooter className="border-t border-gray-200 dark:border-gray-800">
      <div className="gap-2 flex flex-col">
        <Alert className="border-none p-0">
          <AlertTitle className="flex items-end gap-1">
            <AlertTriangleIcon className="size-5 text-yellow-500" /> <span>Sobre a entrega</span>
          </AlertTitle>
          <AlertDescription>
            O seu pedido deverá ser retirado pessoalmente na Universidade de Brasília - Campus Darcy
            Ribeiro
          </AlertDescription>
        </Alert>
        <Textarea placeholder="Adicione uma nota ao seu pedido" className="resize-none mt-2" />
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
    </DrawerFooter>
  );
}
