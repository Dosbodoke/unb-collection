import 'next';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
      NEXT_PUBLIC_MERCADO_PAGO_API_KEY: string;
      NEXT_PUBLIC_INSTAGRAM: string;
      NEXT_PUBLIC_WHATSAPP: string;
      NEXT_PUBLIC_CONTACT_EMAIL: string;
    }
  }
}
