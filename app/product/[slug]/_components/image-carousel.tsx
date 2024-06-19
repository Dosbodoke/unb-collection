"use client";

import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
} from "@/components/ui/carousel";

import React from "react";
import AutoHeight from "embla-carousel-auto-height";
import { UnbCollectionIcon } from "@/assets";
import Image from "next/image";

const ImageCarousel = ({
  image_urls = [],
  productName,
}: {
  image_urls: string[];
  productName: string;
}) => {
  if (image_urls.length === 0) {
    return (
      <div className="w-full h-72 bg-[#eeeff4] grid place-items-center">
        <UnbCollectionIcon />
      </div>
    );
  }

  return (
    <Carousel opts={{ loop: true }}>
      <CarouselNext className="right-2 z-50" />
      <CarouselPrevious className="left-2 z-50" />
      <CarouselContent className="m-0">
        {image_urls.map((url) => (
          <CarouselItem className="bg-transparent p-0">
            <Image
              src={url}
              alt={`Imagem de ${productName}`}
              className="mx-auto w-full"
              width={375}
              height={437}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export { ImageCarousel };
