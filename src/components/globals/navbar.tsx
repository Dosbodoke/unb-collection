import Link from 'next/link';

import { UnbCollectionIcon } from '@/assets';
import { createClient } from '@/utils/supabase/server';

import UserDropdown from '../auth/user-dropdown';
import Carrinho from '../carrinho';

const Navbar = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <nav className="fixed inset-x-2 top-2 z-50 mx-auto items-center justify-between flex max-w-6xl overflow-hidden rounded-xl backdrop-blur-sm bg-white/80 p-3 h-16">
      <Link href="/">
        <UnbCollectionIcon className="fill-black" />
      </Link>
      <div className="flex gap-4 items-center">
        <Carrinho />
        <UserDropdown user={data.user} />
      </div>
    </nav>
  );
};

export { Navbar };
