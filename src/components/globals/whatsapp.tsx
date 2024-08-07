import Link from 'next/link';
import React from 'react';

import { WhatsAppIcon } from '@/assets';

export const WhatsAppButton = () => {
  return (
    <Link
      href="https://wa.link/0h6x8c"
      className="fixed bottom-4 right-4 bg-[#25D366] rounded-xl p-2 shadow z-50"
    >
      <WhatsAppIcon fill="#FFF" width={32} height={32} />
    </Link>
  );
};
