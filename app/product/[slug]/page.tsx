import { Button } from "@/components/ui/button";
import { ProductBreadcrumb } from "./_components/breadcrumb";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { ImageCarousel } from "./_components/image-carousel";
import { ProductPrice } from "./_components/product-price";
import { SizeVariant } from "./_components/size-variant";
import { ColorVariant } from "./_components/color-variant";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function ProductPage({
  params: { slug },
  searchParams,
}: Props) {
  const supabase = createClient();

  const { data: product, error } = await supabase
    .from("product")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
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
          <form className="grid gap-4 md:gap-6">
            <SizeVariant />
            <ColorVariant />
            <ProductPrice price={product.price} discountPercentage={0.2} />
            <div className="flex gap-2">
              <Button
                variant="expandIcon"
                Icon={ShoppingCartIcon}
                iconPlacement="right"
                type="button"
                className="px-6 rounded-sm"
              >
                Adicionar ao carrinho
              </Button>

              <Button
                variant="outline"
                Icon={ShoppingCartIcon}
                iconPlacement="right"
                size="icon"
                type="button"
                className="rounded-sm"
              >
                <HeartIcon />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
