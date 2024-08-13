import { Skeleton } from '@/components/ui/skeleton';

import { ProductBreadcrumb } from '../_components/breadcrumb';

export default function Loading() {
  return (
    <div className="w-full pt-24 max-w-6xl px-4 mx-auto py-6 flex flex-col gap-6">
      <ProductBreadcrumb />

      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
        <div className="relative" role="region" aria-roledescription="carousel">
          <Skeleton className="w-full h-96 rounded-md" />
          <div className="absolute h-8 w-8 rounded-full top-1/2 -translate-y-1/2 right-2 z-50">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
          <div className="absolute h-8 w-8 rounded-full top-1/2 -translate-y-1/2 left-2 z-50">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="grid gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            <div>
              <Skeleton className="w-full h-[2px] rounded-full" />
              <Skeleton className="h-10 w-36 mt-2" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
