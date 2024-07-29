'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBagIcon } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  totalQuantity: number;
}

const CartButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ totalQuantity, ...props }, ref) => {
    return (
      <Button ref={ref} {...props} variant="link" className="relative">
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
      </Button>
    );
  },
);
CartButton.displayName = 'CartButton';

export { CartButton };
