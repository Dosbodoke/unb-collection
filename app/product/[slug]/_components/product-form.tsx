"use client";

import React, { useMemo, useState } from "react";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ProductPrice } from "./product-price";
import { SizeVariant, type Sizes } from "./size-variant";
import { ColorVariant, type Colors } from "./color-variant";
import type { Variant } from "../page";

const ProductForm = ({ productVariants }: { productVariants: Variant[] }) => {
  const [selectedSize, setSelectedSize] = useState<Sizes>();
  const [selectedColor, setSelectedColor] = useState<Colors>();

  const sizes = new Set(
    productVariants.map((product) => product.size?.value as Sizes)
  );

  function handleChangeSize(value: Sizes) {
    setSelectedSize(value);
    setSelectedColor(undefined);
  }

  function handleChangeColor(value: Colors) {
    setSelectedColor(value);
  }

  const colors = useMemo(() => {
    const colorsSet = new Set<Colors>();

    if (selectedSize) {
      const variantsWithSize = productVariants.filter(
        (product) => product.size?.value === selectedSize
      );
      variantsWithSize.forEach((v) => colorsSet.add(v.color.value as Colors));
    } else {
      productVariants.forEach((v) => colorsSet.add(v.color.value as Colors));
    }

    return colorsSet;
  }, [selectedSize]);

  const product =
    productVariants.find((p) => {
      if (selectedSize && selectedColor) {
        return p.size.value === selectedSize && p.color.value === selectedColor;
      }
      if (selectedSize) {
        return p;
      }
      return p;
    }) || productVariants[0];

  if (!product) return null;

  const productInStock = product.stock !== 0;

  return (
    <form className="grid gap-4 md:gap-6">
      <SizeVariant sizes={sizes} onValueChange={handleChangeSize} />
      <ColorVariant colors={colors} onValueChange={handleChangeColor} />
      <ProductPrice
        price={product.price}
        discountPercentage={product.price > 55 ? 0.2 : 0}
      />
      <div className="flex gap-2">
        <Button
          variant="expandIcon"
          Icon={ShoppingCartIcon}
          iconPlacement="right"
          type="button"
          className="px-6"
          disabled={!productInStock}
        >
          {productInStock ? "Adicionar ao carrinho" : "Fora de estoque"}
        </Button>

        <Button
          variant="outline"
          Icon={ShoppingCartIcon}
          iconPlacement="right"
          size="icon"
          type="button"
        >
          <HeartIcon />
        </Button>
      </div>
    </form>
  );
};

export { ProductForm };
