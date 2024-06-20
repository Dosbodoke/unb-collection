"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/utils/cn";
import { Value } from "@radix-ui/react-select";
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
        "border-[#e5e7eb] text-sm font-light bg-transparent border-2 data-[state=checked]:border-[#3b82f6] h-8 w-8 rounded-full hover:shadow-xl transition-shadow ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      value={value}
      {...props}
    ></RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

export const ColorVariant = () => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-base">Cor</Label>
      <RadioGroup>
        <RadioGroupItem value="green" className="bg-green-400" />
        <RadioGroupItem value="blue" className="bg-blue-400" />
        <RadioGroupItem value="black" className="bg-black" />
      </RadioGroup>
    </div>
  );
};
