import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SizeVariant = () => {
  return (
    <Tabs defaultValue="md">
      <div>Tamanho</div>
      <TabsList className="bg-gray-200">
        <TabsTrigger value="xs">XS</TabsTrigger>
        <TabsTrigger value="md">MD</TabsTrigger>
        <TabsTrigger value="lg">LG</TabsTrigger>
      </TabsList>
    </Tabs>
    // <div className="grid gap-2">
    //   <Label htmlFor="size" className="text-base">
    //     Size
    //   </Label>
    //   <RadioGroup
    //     id="size"
    //     defaultValue="m"
    //     aria-label="Tamanho"
    //     className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
    //   >
    //     <Label
    //       htmlFor="size-xs"
    //       className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
    //     >
    //       <RadioGroupItem id="size-xs" value="xs" className="peer sr-only" />
    //       XS
    //     </Label>

    //     <Label
    //       htmlFor="size-sm"
    //       className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
    //     >
    //       <RadioGroupItem id="size-sm" value="sm" className="peer sr-only" />
    //       SM
    //     </Label>

    //     <Label
    //       htmlFor="size-md"
    //       className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
    //     >
    //       <RadioGroupItem id="size-md" value="md" className="peer sr-only" />
    //       MD
    //     </Label>
    //   </RadioGroup>
    // </div>
  );
};
