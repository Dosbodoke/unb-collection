'use client';

import { HeartIcon, ShoppingCartIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { ConfettiButton } from '@/components/magicui/confetti';
import { Button } from '@/components/ui/button';
import { useCartStore, type Variant } from '@/stores/cart-store';

import { type Colors, ColorVariant } from './color-variant';
import { ProductPrice } from './product-price';
import { type Sizes, SizeVariant } from './size-variant';

const ProductForm = ({ productVariants }: { productVariants: Variant[] }) => {
  const { addToCart } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<Sizes>();
  const [selectedColor, setSelectedColor] = useState<Colors>();

  const sizes = new Set(productVariants.map((product) => product.size?.value as Sizes));

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
        (product) => product.size?.value === selectedSize,
      );
      variantsWithSize.forEach((v) => colorsSet.add(v.color.value as Colors));
    } else {
      productVariants.forEach((v) => colorsSet.add(v.color.value as Colors));
    }

    return colorsSet;
  }, [selectedSize]);

  const variant =
    productVariants.find((p) => {
      if (selectedSize && selectedColor) {
        return p.size.value === selectedSize && p.color.value === selectedColor;
      }
      if (selectedSize) {
        return p;
      }
      return p;
    }) || productVariants[0];

  if (!variant) return null;

  const productInStock = variant.stock !== 0;

  return (
    <form className="grid gap-4 md:gap-6">
      <SizeVariant sizes={sizes} onValueChange={handleChangeSize} />
      <ColorVariant colors={colors} onValueChange={handleChangeColor} />
      <ProductPrice price={variant.price} discountPercentage={variant.price > 55 ? 0.2 : 0} />
      <div className="flex gap-2">
        <ConfettiButton
          variant="default"
          Icon={ShoppingCartIcon}
          iconPlacement="right"
          type="button"
          disabled={!productInStock}
          onClick={() => addToCart({ ...variant })}
          className="px-6"
        >
          {productInStock ? 'Adicionar ao carrinho' : 'Fora de estoque'}
        </ConfettiButton>
        <Button variant="outline" size="icon" type="button">
          <HeartIcon />
        </Button>
      </div>
    </form>
  );
};

export { ProductForm };
