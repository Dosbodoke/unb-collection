'use client';

import { CircleCheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Component() {
  const params = useSearchParams();

  // Reference to the Mercado Pago documentation for payment redirect
  // https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/checkout-customization/user-interface/redirection
  const paymentId = params.get('payment_id');
  const status = params.get('status');
  const externalReference = params.get('external_reference');
  const merchantOrderId = params.get('merchant_order_id');

  console.log({
    paymentId,
    status,
    externalReference,
    merchantOrderId,
  });

  return (
    <div className="grid place-items-center flex-1">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <CircleCheckIcon className="size-12 text-green-500" />
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">Seu pedido foi aprovado!</h1>
            <p className="text-muted-foreground">
              O seu pedido <span className="text-primary">#12345</span> foi confirmado.
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Resumo do pedido</h2>
            <ul className="grid gap-4">
              <li className="hover:bg-muted rounded-md px-4 py-2">
                <Link href={`/product/foo`} className="flex flex-row gap-4">
                  {/* {item.product_sku.product.cover ? (
                    <Image
                      src={
                        supabase.storage
                          .from('products')
                          .getPublicUrl(item.product_sku.product.cover).data.publicUrl
                      }
                      alt={item.product_sku.product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  ) : null} */}
                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="font-medium">Camisa foo</h3>
                    {/* <h3 className="font-medium">{item.product_sku.product.name}</h3> */}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">R$20 x 2</p>

                      {/* {item.quantity !== 1 ? ( */}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {/* R${item.product_sku.price.toFixed(2)} x {item.quantity} */}
                      </p>
                      {/* ) : null} */}

                      <p className="font-medium">
                        200
                        {/* ${(item.product_sku.price * item.quantity).toFixed(2)} */}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>$299.00</span>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center">
            Obrigado pela preferência!! Se precisar de qualquer suporte não hesite, contate-nos
          </p>
          <div className="flex gap-2">
            <Link href="#" className="flex-1" prefetch={false}>
              <Button variant="outline" className="w-full">
                Ver detalhes do pedido
              </Button>
            </Link>
            <Link href="#" className="flex-1" prefetch={false}>
              <Button className="w-full">Continuar comprando</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
