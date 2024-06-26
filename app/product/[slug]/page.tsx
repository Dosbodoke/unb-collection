import { notFound } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import type { Variant } from "@/hooks/use-cart";

import { ProductBreadcrumb } from "./_components/breadcrumb";
import { ImageCarousel } from "./_components/image-carousel";
import { ProductForm } from "./_components/product-form";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
};

// Type guard to ensure size and color are not null
function isValidVariant(variant: any): variant is Variant {
  return variant.size !== null && variant.color !== null;
}

export default async function ProductPage({ params: { slug } }: Props) {
  const supabase = createClient();

  const { data: product, error } = await supabase
    .from("product")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return notFound();
  }

  const { data: variants, error: variantError } = await supabase
    .from("products_skus")
    .select(
      `*,
      size:product_attributes!products_skus_size_attribute_id_fkey(value),
      color:product_attributes!products_skus_color_attribute_id_fkey(value),
      product:product!products_skus_product_id_fkey(*)
    `
    )
    .eq("product_id", product.id);

  if (!variants || variants.length === 0 || variantError) {
    return notFound();
  }

  // Use the type guard to filter out invalid variants
  const validVariants = variants.filter(isValidVariant);

  if (validVariants.length === 0) {
    return notFound();
  }

  return (
    <div className="max-w-6xl px-4 mx-auto py-6 flex flex-col gap-6">
      <ProductBreadcrumb itemName={product.name} />
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
        <ImageCarousel
          image_urls={
            [
              product.cover
                ? supabase.storage.from("products").getPublicUrl(product.cover)
                    .data.publicUrl
                : null,
              ...product.images.map(
                (image) =>
                  supabase.storage.from("products").getPublicUrl(image).data
                    .publicUrl
              ),
            ].filter((val) => val !== null) as string[]
          }
          productName={product.name}
        />
        <div className="space-y-4">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl lg:text-4xl">{product.name}</h1>
            {product.description ? <p>{product.description}</p> : null}
          </div>
          <ProductForm productVariants={validVariants} />
        </div>
      </div>
    </div>
  );
}
