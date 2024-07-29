import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function EmptyCart() {
  return (
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
        <h2 className="text-center text-xl text-muted-foreground">Seu carrinho está vazio</h2>
        <Button className="text-center" variant="link" asChild>
          <Link href="/products">Explorar produtos</Link>
        </Button>
      </div>
    </div>
  );
}
