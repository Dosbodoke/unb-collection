import { AnimatePresence, motion } from 'framer-motion';
import { TagIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export const ProductPrice = ({
  price,
  discountPercentage,
}: {
  price: number;
  discountPercentage?: number;
}) => {
  const originalPrice = price.toFixed(2);
  const discountedPrice = (price * (1 - (discountPercentage || 0))).toFixed(2);

  return (
    <div>
      <div className="w-full h-[2px] bg-secondary-foreground rounded-full shadow mb-2"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${originalPrice}-${discountedPrice}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {discountPercentage ? (
            <div className="flex items-center gap-2">
              {' '}
              <div className="line-through text-muted-foreground text-base">
                R${price.toFixed(2)}
              </div>
              <Badge
                variant="outline"
                className="py-1 flex gap-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
              >
                <TagIcon className="w-4 h-4" />
                <span>{(discountPercentage * 100).toFixed(0)}% off</span>
              </Badge>
            </div>
          ) : null}
          <span className="text-4xl font-bold">R${discountedPrice}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
