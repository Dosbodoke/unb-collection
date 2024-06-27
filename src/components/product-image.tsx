"use client";

import { useState } from "react";
import Image from "next/image";

const ImageWithHover = ({
  productName,
  cover,
  back,
}: {
  productName: string;
  cover: string;
  back: string | null;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[437px] max-w-md">
        <Image
          src={cover}
          alt={`${productName} cover image`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered && back ? "opacity-0" : "opacity-100"
          }`}
          width={375}
          height={437}
          priority={true}
        />
        {back ? (
          <Image
            src={back}
            alt={`${productName} back image`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            width={375}
            height={437}
            priority={true}
          />
        ) : null}
      </div>
    </div>
  );
};

export { ImageWithHover };
