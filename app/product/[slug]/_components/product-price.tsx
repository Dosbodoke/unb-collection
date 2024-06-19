import { Badge } from "@/components/ui/badge";

export const ProductPrice = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="line-through text-muted-foreground text-base">
          R${(99 * (1 - 0.2)).toFixed(2)}
        </div>
        <Badge
          variant="outline"
          className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        >
          {(0.2 * 100).toFixed(0)}% off
        </Badge>
      </div>
      <div className="text-4xl font-bold">R${(99 * (1 - 0.2)).toFixed(2)}</div>
    </div>
  );
};
