import React from "react";

import { createClient } from "@/utils/supabase/server";
import { UnbCollectionIcon } from "@/assets";
import Link from "next/link";
import Image from "next/image";
import { ImageWithHover } from "./product-image";

const ProductGrid = async () => {
  const supabase = createClient();

  const { data: highlights, error } = await supabase.from("highlights").select(`
    id,
    product(*)
  `);

  if (error) return null;

  const products = highlights.flatMap((h) => h.product || []);

  return (
    <ul className="grid w-full max-w-6xl mx-auto sm:grid-cols-3 grid-cols-2">
      {products.map((product, index) => (
        <li
          key={product.id}
          className={`bg-white border border-black ${
            index % 2 !== 1 ? "border-r-0" : ""
          } ${
            index < products.length - (products.length % 2 === 0 ? 2 : 1)
              ? "border-b-0"
              : ""
          }`}
        >
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
                  supabase.storage
                    .from("products")
                    .getPublicUrl(product.images[0]).data.publicUrl
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
              <p className="text-gray-500">R${product.price.toFixed(2)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export { ProductGrid };
