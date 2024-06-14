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

// "use client";

// import {
//   Carousel,
//   CarouselIndicator,
//   CarouselMainContainer,
//   CarouselNext,
//   CarouselPrevious,
//   CarouselThumbsContainer,
//   SliderMainItem,
// } from "@/components/extension/carousel";
// import Image from "next/image";

// import { createClient } from "@/utils/supabase/server";

// import Autoplay from "embla-carousel-autoplay";

// const HeroCarousel = () => {
//   // const supabase = createClient();

//   // const promoList = await supabase.storage.from("promo").list();
//   // const buckets = await supabase.storage.listBuckets();

//   // console.log({ buckets });

//   return (
//     <Carousel
//       carouselOptions={{ loop: true }}
//       plugins={[
//         Autoplay({
//           delay: 100,
//         }),
//       ]}
//     >
//       <CarouselNext className="right-2" />
//       <CarouselPrevious className="left-2" />
//       <div className="relative">
//         <CarouselMainContainer className="h-[437px]">
//           {Array.from({ length: 3 }).map((_, index) => (
//             <SliderMainItem key={index + 1} className="bg-transparent p-0">
//               <Image
//                 width={375}
//                 height={437}
//                 src={`/unb_collection_${index + 1}.png`}
//                 alt="UNB Collection promo banner"
//               />
//             </SliderMainItem>
//           ))}
//         </CarouselMainContainer>
//         <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
//           <CarouselThumbsContainer className="gap-x-1 ">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <CarouselIndicator key={index} index={index} />
//             ))}
//           </CarouselThumbsContainer>
//         </div>
//       </div>
//     </Carousel>
//   );
// };

// export { HeroCarousel };
