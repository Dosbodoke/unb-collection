import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from "@/components/extension/carousel";
import Image from "next/image";

const HeroCarousel = () => {
  return (
    <Carousel carouselOptions={{ loop: true }}>
      <CarouselNext className="right-2" />
      <CarouselPrevious className="left-2" />
      <div className="relative">
        <CarouselMainContainer className="h-[437px]">
          {Array.from({ length: 3 }).map((_, index) => (
            <SliderMainItem key={index} className="bg-transparent">
              <Image
                fill={true}
                src={`/unb_collection_${index + 1}.png`}
                alt="UNB Collection promo banner"
              />
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <CarouselThumbsContainer className="gap-x-1 ">
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselIndicator key={index} index={index} />
            ))}
          </CarouselThumbsContainer>
        </div>
      </div>
    </Carousel>
  );
};

export { HeroCarousel };
