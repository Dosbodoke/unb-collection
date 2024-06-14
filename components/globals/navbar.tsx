import { UnbCollectionIcon } from "@/assets";
import { MenuIcon, ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-2 top-2 z-50 mx-auto items-center justify-between flex max-w-6xl overflow-hidden rounded-xl backdrop-blur-sm bg-white/80 p-3 h-16">
      <Link href="/">
        <UnbCollectionIcon className="fill-black" />
      </Link>
      <div className="flex gap-4 items-center">
        <Button asChild variant="link" className="relative">
          <Link href="/carrinho">
            <ShoppingBagIcon className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-1 rounded-full bg-primary text-xs text-white">
              2
            </Badge>
          </Link>
        </Button>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
};

export { Navbar };
