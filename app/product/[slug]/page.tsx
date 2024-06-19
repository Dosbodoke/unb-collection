import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProductBreadcrumb } from "./_components/breadcrumb";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ShoppingCartIcon } from "lucide-react";
import { ImageCarousel } from "./_components/image-carousel";
import { ProductPrice } from "./_components/product-price";
import { SizeVariant } from "./_components/size-variant";

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
            <ProductPrice />
          </div>
          <form className="grid gap-4 md:gap-6">
            <div className="grid gap-2">
              <Label htmlFor="color" className="text-base">
                Color
              </Label>
              <RadioGroup
                id="color"
                defaultValue="black"
                className="flex items-center gap-2"
              >
                <Label
                  htmlFor="color-black"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                >
                  <RadioGroupItem id="color-black" value="black" />
                  Black
                </Label>
                <Label
                  htmlFor="color-white"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                >
                  <RadioGroupItem id="color-white" value="white" />
                  White
                </Label>
                <Label
                  htmlFor="color-blue"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                >
                  <RadioGroupItem id="color-blue" value="blue" />
                  Blue
                </Label>
              </RadioGroup>
            </div>
            <SizeVariant />
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-base">
                Quantidade
              </Label>
              <Select defaultValue="1">
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: product.stock }).map((_, idx) => (
                    <SelectItem value={(idx + 1).toString()}>
                      {idx + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="expandIcon"
              Icon={ShoppingCartIcon}
              iconPlacement="right"
              size="lg"
              type="button"
            >
              Adicionar ao carrinho
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
