import Marquee from "@/components/magicui/marquee";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { UnbCollectionIcon, UnbInlineIcon } from "@/assets";
import ProductGrid from "@/components/ProductGrid";
import { HeroCarousel } from "./_components/hero-carousel";

export default async function Index() {
  return (
    <div className="animate-in flex-1 flex flex-col w-full gap-4">
      <HeroCarousel />
      <div className="relative w-full overflow-hidden">
        <Marquee
          pauseOnHover
          className="[--duration:8s]"
          style={{
            maskImage:
              "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
          }}
          repeat={6}
        >
          <p className="font-bold italic md:text-3xl text-xl text-gray-900">
            UNB COLLECTION
          </p>
          <span>
            <UnbInlineIcon />
          </span>
        </Marquee>
      </div>

      <h2 className="text-2xl font-semibold text-center my-3">Destaques</h2>
      <ProductGrid />
    </div>
  );
}
