'use client';

import { useRouter } from 'next/navigation';

import { AuthCard } from '@/components/auth/auth-card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function Component() {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="block max-w-lg border-none bg-transparent p-0 shadow-none animate-none rounded-none overflow-hidden">
        <AuthCard onLogin={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
}
