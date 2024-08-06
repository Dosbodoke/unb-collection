import { CircleCheckIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Item } from '@/components/carrinho/_components/item';
import { getPreference } from '@/components/carrinho/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function OrderDetails({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Reference to the Mercado Pago documentation for payment redirect
  // https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/checkout-customization/user-interface/redirection
  const status = searchParams?.status;
  const preferenceId = searchParams?.preference_id;

  if (typeof preferenceId !== 'string') {
    return notFound();
  }

  const metadata = await getPreference(preferenceId);

  if (!metadata) {
    return notFound();
  }

  return (
    <div className="grid place-items-center flex-1">
      <Card className="w-full max-w-md p-6 sm:p-8 relative">
        {status === 'approved' ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <CircleCheckIcon className="size-12 text-green-500" />
            <div className="grid gap-2 text-center">
              <h1 className="text-2xl font-bold">Seu pedido foi aprovado!</h1>
              <p className="text-muted-foreground">
                O seu pedido <span className="text-green-500">#{metadata.orderId}</span> foi
                confirmado.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <ClockIcon className="size-12 text-blue-500" />
            <div className="grid gap-2 text-center">
              <h1 className="text-2xl font-bold">Seu pedido está pendente!</h1>
              <p className="text-muted-foreground">
                O seu pedido <span className="text-primary">#{metadata.orderId}</span> está em
                análise.
              </p>
            </div>
          </div>
        )}
        <Separator className="my-6" />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Resumo do pedido</h2>
            <ul className="grid gap-4 overflow-auto max-h-48">
              {metadata.items.map((item) => (
                <Item key={item.id} item={item} isOrdered />
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>R${metadata.total}</span>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center">
            Obrigado pela preferência!! Se precisar de qualquer suporte não hesite, contate-nos
          </p>
          <div className="flex gap-2">
            <Link href="/" className="flex-1" prefetch={false}>
              <Button className="w-full">Continuar comprando</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
