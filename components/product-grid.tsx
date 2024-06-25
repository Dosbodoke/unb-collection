import React from "react";

import { createClient } from "@/utils/supabase/server";
import { UnbCollectionIcon } from "@/assets";
import Link from "next/link";
import { ImageWithHover } from "./product-image";

const ProductGrid = async () => {
  const supabase = createClient();

  const { data: highlights, error } = await supabase.from("highlights").select(`
    id,
    product(
      *,
      products_skus(*)
    )
  `);

  if (error) return null;

  const products = highlights.flatMap((h) => h.product || []);

  return (
    <ul className="grid w-full max-w-6xl mx-auto sm:grid-cols-3 grid-cols-2">
      {products.map((product, index) => (
        <li key={product.id} className="bg-white border border-black">
          <Link
            href={`/product/${product.slug}`}
            className="flex flex-col items-center"
          >
            {product.cover ? (
              <ImageWithHover
                cover={
                  supabase.storage.from("products").getPublicUrl(product.cover)
                    .data.publicUrl
                }
                back={
                  product.images && product.images.length > 0
                    ? supabase.storage
                        .from("products")
                        .getPublicUrl(product.images[0]!).data.publicUrl
                    : null
                }
                productName={product.name}
              />
            ) : (
              <div className="w-full h-72 bg-[#eeeff4] grid place-items-center">
                <UnbCollectionIcon />
              </div>
            )}
            <div className="p-2 pb-6 w-full mt-auto border-t border-black">
              <h3 className="text-sm truncate">{product.name}</h3>
              <p className="text-gray-500">
                {product.products_skus && product.products_skus.length > 0
                  ? `R$${Math.min(
                      ...product.products_skus.map((sku) => sku.price)
                    ).toFixed(2)}`
                  : "Preço indisponível"}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export { ProductGrid };
