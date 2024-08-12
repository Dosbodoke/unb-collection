'use server';

import { revalidateTag, unstable_cache } from 'next/cache';

import { createClient } from '@/utils/supabase/server';

export const getProduct = async (params: { slug: string }) => {
  const supabase = createClient();
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error || !data) {
        return { product: null, variants: null, error };
      }

      // Fetch cover image if available
      const coverImageURL = data.cover
        ? supabase.storage.from('products').getPublicUrl(data.cover).data.publicUrl || null
        : null;

      // Fetch all other image URLs
      const backImageUrls = data.images
        ? data.images.map(
            (image) => supabase.storage.from('products').getPublicUrl(image).data.publicUrl || null,
          )
        : [];

      const imageUrls = [coverImageURL, ...backImageUrls].filter((val) => val !== null) as string[];

      const { data: variants, error: variantError } = await supabase
        .from('products_skus')
        .select(
          `*,
            size:product_attributes!products_skus_size_attribute_id_fkey(value),
            color:product_attributes!products_skus_color_attribute_id_fkey(value),
            product:product!products_skus_product_id_fkey(*)
          `,
        )
        .eq('product_id', data.id);

      if (variantError) {
        return { product: { ...data, imageUrls }, variants: null, error: variantError };
      }

      return { product: { ...data, imageUrls }, variants };
    },
    ['product', params.slug],
    {
      tags: [`product_${params.slug}`],
      revalidate: 3600,
    },
  )();
};

export const invalidateProduct = ({ slug }: { slug: string }) => {
  revalidateTag(`product_${slug}`);
};
