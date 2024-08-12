'use server';

import { revalidateTag, unstable_cache } from 'next/cache';

import { createClient } from '@/utils/supabase/server';

export const getPromo = async () => {
  const supabase = createClient();
  return unstable_cache(
    async () => {
      const { data, error } = await supabase.storage.from('promo').list();

      if (error || !data) {
        return { promoList: null, error };
      }

      // Fetch image URL's
      const urls =
        data.map((file) => supabase.storage.from('promo').getPublicUrl(file.name).data.publicUrl) ||
        [];

      return { promoList: urls };
    },
    ['promo'],
    {
      tags: [`promo`],
      revalidate: 1 * 60 * 60 * 24, // one day
    },
  )();
};

export const invalidatePromo = () => {
  revalidateTag(`promo`);
};
