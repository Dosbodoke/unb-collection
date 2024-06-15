"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  CarouselIndicator,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import Image from "next/image";

const HeroCarousel = ({ items }: { items: string[] }) => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          stopOnInteraction: true,
        }),
      ]}
      opts={{ loop: true }}
    >
      <CarouselContent className="m-0">
        {items.map((item, index) => (
          <CarouselItem key={index + 1} className="bg-transparent p-0">
            <Image
              className="mx-auto w-full max-w-md"
              width={375}
              height={437}
              src={item}
              alt="UNB Collection promo banner"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="right-2" />
      <CarouselPrevious className="left-2" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <CarouselThumbsContainer className="gap-x-1 ">
          {items.map((_, index) => (
            <CarouselIndicator key={index} index={index} />
          ))}
        </CarouselThumbsContainer>
      </div>
    </Carousel>
  );
};

export { HeroCarousel };
