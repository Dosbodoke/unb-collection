import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

import { UnbCollectionIcon } from '@/assets';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';

import UserDropdown from '../auth/user-dropdown';
import { CartButton } from './cart-button';

const Navbar = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <nav className="fixed inset-x-2 top-2 z-50 mx-auto items-center justify-between flex max-w-6xl overflow-hidden rounded-xl backdrop-blur-sm bg-white/80 p-3 h-16">
      <Link href="/">
        <UnbCollectionIcon className="fill-black" />
      </Link>
      <div className="flex gap-4 items-center">
        <CartButton />
        <UserDropdown user={data.user} />
        <Button variant="outline" size="icon">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
};

export { Navbar };
