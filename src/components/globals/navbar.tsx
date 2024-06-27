import { UnbCollectionIcon } from "@/assets";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { CartButton } from "./cart-button";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-2 top-2 z-50 mx-auto items-center justify-between flex max-w-6xl overflow-hidden rounded-xl backdrop-blur-sm bg-white/80 p-3 h-16">
      <Link href="/">
        <UnbCollectionIcon className="fill-black" />
      </Link>
      <div className="flex gap-4 items-center">
        <CartButton />
        <Button variant="outline" size="icon">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
};

export { Navbar };
