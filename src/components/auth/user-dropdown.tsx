"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { LoaderCircleIcon, LogOutIcon, User2Icon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function UserDropdown({ user }: { user: User | null }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.refresh();
  };

  if (!user) {
    <Button type="button" variant="ghost" size="icon" asChild>
      <Link href="/login">
        <User2Icon />
      </Link>
    </Button>;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon">
          {loading ? (
            <LoaderCircleIcon className="animate-spin text-muted-foreground" />
          ) : (
            <User2Icon />
          )}
          <span className="sr-only">Menu do usuário</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="text-red-600 flex justify-between cursor-pointer"
          disabled={loading}
          onClick={handleSignOut}
        >
          <span>Sair</span>
          <LogOutIcon className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
