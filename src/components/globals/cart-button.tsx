'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';

const CartButton = () => {
  const { totalQuantity } = useCartStore();

  return (
    <Button asChild variant="link" className="relative">
      <Link href="/carrinho">
        <ShoppingBagIcon className="h-6 w-6" />
        <AnimatePresence mode="wait">
          <Badge className="absolute -top-2 -right-1 rounded-full bg-primary text-xs text-white">
            <motion.div
              key={`${totalQuantity}-items`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="tabular-nums"
            >
              {totalQuantity}
            </motion.div>
          </Badge>
        </AnimatePresence>
      </Link>
    </Button>
  );
};

export { CartButton };
