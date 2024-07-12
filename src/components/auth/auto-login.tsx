'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { createClient } from '@/utils/supabase/client';

const GoogleOneTapLogin = () => {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();

      // Show popup after one seconds
      if (!data.user) {
        setTimeout(() => {
          oneTap();
        }, 1000);
      }
    }

    getUser();
  }, []);

  async function handleSignInWithGoogle(response: any) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });

    if (data.user) {
      router.refresh();
    }
  }

  const oneTap = () => {
    const { google } = window;

    if (google) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
        callback: handleSignInWithGoogle,
        use_fedcm_for_prompt: true,
        cancel_on_tap_outside: false,
      });

      // Here we just console.log some error situations and reason why the google one tap
      // is not displayed. You may want to handle it depending on your application

      google.accounts.id.prompt(); // without listening to notification
    }
  };

  return null;
};

export default GoogleOneTapLogin;
