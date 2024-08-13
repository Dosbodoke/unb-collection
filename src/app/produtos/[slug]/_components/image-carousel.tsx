'use client';

import Image from 'next/image';
import React from 'react';

import { UnbCollectionIcon } from '@/assets';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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
      <CarouselContent className="-ml-2">
        {image_urls.map((url) => (
          <CarouselItem key={`item-${url}`} className="bg-transparent pl-2">
            <Image
              src={url}
              alt={`Imagem de ${productName}`}
              className="mx-auto w-full rounded-md"
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
