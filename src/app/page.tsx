import { ProductGrid } from "@/components/product-grid";
import DotPattern from "@/components/magicui/dot-pattern";
import SparklesText from "@/components/magicui/sparkles-text";

import { createClient } from "@/utils/supabase/server";
import { HeroSection } from "./_components/hero-section";

export default async function Index() {
  const supabase = createClient();

  const promoList = await supabase.storage.from("promo").list();
  const urls =
    promoList.data?.map(
      (file) =>
        supabase.storage.from("promo").getPublicUrl(file.name).data.publicUrl
    ) || [];

  return (
    <div className="flex-1 flex flex-col pt-24">
      <HeroSection items={urls} />
      <SparklesText
        className="text-center py-8"
        text="Destaques"
        colors={{
          first: "#ff2975 ",
          second: "#8c1eff",
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
