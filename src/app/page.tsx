import { getPromo } from '@/cache/promo';
import DotPattern from '@/components/magicui/dot-pattern';
import SparklesText from '@/components/magicui/sparkles-text';
import { ProductGrid } from '@/components/product-grid';

import { HeroSection } from './_components/hero-section';

export default async function Index() {
  const { promoList } = await getPromo();

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
      <ProductGrid />
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
