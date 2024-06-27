"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/utils/cn";
import { Label } from "@/components/ui/label";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ value, className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "border-[#e5e7eb] text-sm font-light bg-white border data-[state=checked]:border-[#3b82f6] h-10 rounded-md p-2 flex-1 hover:shadow-xl transition-shadow ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      value={value}
      {...props}
    >
      {value}
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

export type Sizes = "P" | "M" | "G";

export const SizeVariant = ({
  sizes,
  onValueChange,
}: {
  sizes: Set<Sizes>;
  onValueChange: (value: Sizes) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-base">Tamanho</Label>
      <RadioGroup onValueChange={onValueChange}>
        <RadioGroupItem
          className="flex-grow-0 px-3"
          value="P"
          disabled={!sizes.has("P")}
        />
        <RadioGroupItem
          className="flex-grow-0 px-3"
          value="M"
          disabled={!sizes.has("M")}
        />
        <RadioGroupItem
          className="flex-grow-0 px-3"
          value="G"
          disabled={!sizes.has("G")}
        />
      </RadioGroup>
    </div>
  );
};
