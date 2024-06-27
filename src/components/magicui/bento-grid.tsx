import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  imageUrl,
  description,
  href,
  cta,
}: {
  name: string;
  className?: string;
  imageUrl: string;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative w-full h-full bg-cover bg-center",
      "col-span-3 overflow-hidden rounded-xl",
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "transform-gpu",
      className
    )}
    style={{
      backgroundImage: `url(${imageUrl})`,
    }}
  >
    <div className="absolute bottom-0 w-full backdrop-blur-md border border-white/20 rounded-t-xl bg-opacity-30 bg-white pointer-events-none z-10 flex transform-gpu flex-col gap-2 p-4 transition-all duration-300 group-hover:max-h-[200px] group-hover:bg-opacity-50 overflow-hidden">
      <div>
        <h3 className="text-xl font-semibold text-popover-foreground">
          {name}
        </h3>
        <p className="max-w-lg text-popover-foreground">{description}</p>
      </div>
      <div
        className={cn(
          "translate-y-5 max-h-0 overflow-hidden transform-gpu opacity-0 transition-all duration-300 group-hover:max-h-[100px] group-hover:opacity-100 group-hover:translate-y-0"
        )}
      >
        <Button
          variant="secondary"
          asChild
          size="sm"
          className="pointer-events-auto"
        >
          <Link href={href}>
            {cta}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
