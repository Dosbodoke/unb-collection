// import { FilterIcon } from 'lucide-react';
import React from 'react';

import { ProductGrid } from '@/components/product-grid';
// import { Button } from '@/components/ui/button';
// import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { createClient } from '@/utils/supabase/server';

import { ProductBreadcrumb } from './_components/breadcrumb';

export default async function ProductsPage() {
  const supabase = createClient();

  const { data: products } = await supabase.from('product').select(`
        *,
        products_skus(*)
      `);

  return (
    <div className="flex-1 flex flex-col pt-24">
      <div className="w-full max-w-6xl px-4 mx-auto py-6 flex flex-col gap-6">
        <ProductBreadcrumb />

        <header className="flex justify-between">
          <h1 className="font-bold text-3xl lg:text-4xl">Produtos</h1>

          {/* <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button>
                <FilterIcon className="size-4 mr-2" /> Filtro
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div>FOO</div>
            </DrawerContent>
          </Drawer> */}
        </header>

        <section>
          <ProductGrid products={products || []} />
        </section>
      </div>
    </div>
  );
}
