"use client";

import { useState } from "react";
import Image from "next/image";
// import Link from "next/link";

const ImageWithHover = ({
  productName,
  cover,
  back,
}: {
  productName: string;
  cover: string;
  back: string | null;
}) => {
  const [currentImage, setCurrentImage] = useState(cover);

  const showBackCover = () => {
    if (back) setCurrentImage(back);
  };
  const showFrontCover = () => {
    setCurrentImage(cover);
  };

  return (
    <div
      className="w-full relative"
      onMouseEnter={showBackCover}
      onMouseLeave={showFrontCover}
      onTouchStart={showBackCover}
      onTouchEnd={showFrontCover}
    >
      <Image
        src={currentImage}
        alt={`${productName} image`}
        className="mx-auto w-full object-cover h-[437px] max-w-md"
        width={375}
        height={437}
        priority={true}
      />
      {/* {back ? <Link rel="preload" href={back} as="image" /> : null} */}
    </div>
  );
};

export { ImageWithHover };
