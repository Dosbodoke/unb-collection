import { redirect } from 'next/navigation';

import { AuthCard } from '@/components/auth/auth-card';
import { createClient } from '@/utils/supabase/server';

export default async function LoginPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect('/');
  }

  return (
    <div className="grid place-items-center flex-1">
      <AuthCard />
    </div>
  );
}
