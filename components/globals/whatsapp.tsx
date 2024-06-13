import React from "react";

import { WhatsAppIcon } from "@/assets";
import Link from "next/link";

export const WhatsAppButton = () => {
  return (
    <Link
      href="https://wa.link/0h6x8c"
      className="fixed bottom-4 right-4 bg-[#25D366] rounded-xl p-2 shadow"
    >
      <WhatsAppIcon fill="#FFF" width={32} height={32} />
    </Link>
  );
};
