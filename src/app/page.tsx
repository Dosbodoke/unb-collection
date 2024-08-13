import { getPromo } from '@/cache/promo';
import DotPattern from '@/components/magicui/dot-pattern';
import SparklesText from '@/components/magicui/sparkles-text';
import { ProductGrid } from '@/components/product-grid';
import { createClient } from '@/utils/supabase/server';

import { HeroSection } from './_components/hero-section';

export default async function Index() {
  const supabase = createClient();
  const { promoList } = await getPromo();

  const { data: highlights, error } = await supabase.from('highlights').select(`
    id,
    product(
      *,
      products_skus(*)
    )
  `);

  if (error) return null;

  const products = highlights.flatMap((h) => h.product || []);

  return (
    <div className="flex-1 flex flex-col pt-24">
      <HeroSection items={promoList || []} />
      <SparklesText
        className="text-center py-8"
        text="Destaques"
        colors={{
          first: '#ff2975 ',
          second: '#8c1eff',
        }}
        sparklesCount={6}
      />
      <ProductGrid products={products} />
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className="absolute z-[-10] [mask-image:linear-gradient(to_bottom,white,transparent)]"
      />
    </div>
  );
}
