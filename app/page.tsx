import Marquee from "@/components/magicui/marquee";

import { UnbCollectionIcon, UnbInlineIcon } from "@/assets";
import { ProductGrid } from "@/components/ProductGrid";
import { HeroCarousel } from "./_components/hero-carousel";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/utils/cn";
import SparklesText from "@/components/magicui/sparkles-text";

import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = createClient();

  const promoList = await supabase.storage.from("promo").list();
  const urls =
    promoList.data?.map(
      (file) =>
        supabase.storage.from("promo").getPublicUrl(file.name).data.publicUrl
    ) || [];

  return (
    <div className="flex-1 flex flex-col">
      <HeroCarousel items={urls} />
      <div className="relative h-full w-full overflow-hidden space-y-4 py-8">
        <div className="relative w-full overflow-hidden z-50">
          <Marquee
            pauseOnHover
            className="[--duration:8s]"
            style={{
              maskImage:
                "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
            }}
            repeat={6}
          >
            <p className="my-auto font-bold italic md:text-3xl text-xl text-gray-900">
              UNB COLLECTION
            </p>
            <span>
              <UnbInlineIcon />
            </span>
          </Marquee>
        </div>
        <SparklesText
          className="text-center"
          text="Destaques"
          colors={{
            first: "#ff2975 ",
            second: "#8c1eff",
          }}
          sparklesCount={6}
        />
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom,white,transparent)] "
          )}
        />
      </div>
      <ProductGrid />
    </div>
  );
}
