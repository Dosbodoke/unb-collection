"use client";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { HeroCarousel } from "./hero-carousel";
import { useMediaQuery } from "@/hooks/use-media-query";

export const HeroSection = ({ items }: { items: string[] }) => {
  const isBigScreen = useMediaQuery("(min-width: 1280px)");

  const features = [
    {
      name: "UNB Collection",
      description: "A loja do universitário",
      href: "/",
      cta: "Learn more",
      imageUrl: "/UNB-dark.svg",
      className:
        "xl:col-start-1 xl:col-end-4 xl:row-start-7 xl:row-end-11 bg-cover bg-no-repeat",
    },
    {
      name: "Cropped UNB",
      description: "Perfeiro para os dias de calor",
      href: "/product/cropped-manga-longa",
      cta: "Ver cropped",
      imageUrl: items[1],
      className: "xl:col-start-4 xl:col-end-13 xl:row-start-7 xl:row-end-11",
    },
    {
      name: "Collection I",
      description: "A primeira coleção da nossa loja",
      href: "#",
      cta: "Explorar coleção",
      imageUrl: items[0],
      className: "xl:col-start-1 xl:col-end-13 xl:row-start-1 xl:row-end-7",
    },
  ];

  if (isBigScreen) {
    return (
      <BentoGrid className="auto-rows-[4rem] px-64 grid-cols-12">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    );
  }

  return <HeroCarousel items={items} />;
};
