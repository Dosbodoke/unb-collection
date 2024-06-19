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
  back: string;
}) => {
  const [currentImage, setCurrentImage] = useState(cover);

  const handleMouseEnter = () => setCurrentImage(back);
  const handleMouseLeave = () => setCurrentImage(cover);
  const handleTouchStart = () => setCurrentImage(back);

  return (
    <div
      className="w-full relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseLeave}
    >
      <Image
        src={currentImage}
        alt={`${productName} image`}
        className="mx-auto w-full object-cover h-[437px] max-w-md"
        width={375}
        height={437}
      />
    </div>
  );
};

export { ImageWithHover };
