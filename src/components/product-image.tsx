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
  return (
    <div className="w-full relative">
      <div
        className="relative w-full aspect-[9/16] max-w-md group"
        data-back={!!back}
      >
        <Image
          src={cover}
          alt={`${productName} cover image`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-data-[back=true]:hover:opacity-0`}
          width={375}
          height={437}
          priority={true}
        />
        {back ? (
          <Image
            src={back}
            alt={`${productName} back image`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-data-[back=true]:hover:opacity-100`}
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
