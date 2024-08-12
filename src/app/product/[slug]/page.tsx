import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { getProduct } from '@/cache/product';
import type { Variant } from '@/stores/cart-store';

import { ProductBreadcrumb } from './_components/breadcrumb';
import { ImageCarousel } from './_components/image-carousel';
import { ProductForm } from './_components/product-form';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
};

// Type guard to ensure size and color are not null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidVariant(variant: any): variant is Variant {
  return variant.size !== null && variant.color !== null;
}

export async function generateMetadata(
  { params: { slug } }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { error, product } = await getProduct({ slug });

  if (error || !product) {
    return {
      title: 'Produto não encontrado',
    };
  }

  // Fetch the base URL from the parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const coverUrl = product.imageUrls.length > 0 ? product.imageUrls[0] : undefined;

  return {
    title: product.name,
    description: product.description || `UNB COLLECTION | ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description || `UNB COLLECTION | ${product.name}`,
      images: coverUrl ? [coverUrl, ...previousImages] : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `UNB COLLECTION | ${product.name}`,
      images: coverUrl ? [coverUrl, ...previousImages] : previousImages,
    },
  };
}

export default async function ProductPage({ params: { slug } }: Props) {
  const { error, product, variants } = await getProduct({ slug });

  if (error || !product || !variants || variants.length === 0) {
    return notFound();
  }

  // Use the type guard to filter out invalid variants
  const validVariants = variants.filter(isValidVariant);

  if (validVariants.length === 0) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col pt-24">
      <div className="max-w-6xl px-4 mx-auto py-6 flex flex-col gap-6">
        <ProductBreadcrumb itemName={product.name} />
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
          <ImageCarousel image_urls={product.imageUrls} productName={product.name} />
          <div className="space-y-4">
            <div className="grid gap-4">
              <h1 className="font-bold text-3xl lg:text-4xl">{product.name}</h1>
              {product.description ? <p>{product.description}</p> : null}
            </div>
            <ProductForm productVariants={validVariants} />
          </div>
        </div>
      </div>
    </div>
  );
}
