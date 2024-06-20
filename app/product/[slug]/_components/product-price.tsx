import { Badge } from "@/components/ui/badge";
import { TagIcon } from "lucide-react";

export const ProductPrice = ({
  price,
  discountPercentage,
}: {
  price: number;
  discountPercentage?: number;
}) => {
  return (
    <div>
      <div className="w-full h-[2px] bg-secondary-foreground rounded-full shadow mb-2"></div>
      {discountPercentage ? (
        <div className="flex items-center gap-2">
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

      <div className="text-4xl font-bold">
        R${(price * (1 - (discountPercentage || 0))).toFixed(2)}
      </div>
    </div>
  );
};
