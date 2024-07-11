import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

import "./globals.css";

import { Navbar } from "@/components/globals/navbar";
import { WhatsAppButton } from "@/components/globals/whatsapp";
import { Footer } from "@/components/globals/footer";
import AutoLogin from "@/components/auth/auto-login";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  applicationName: "UNB Collection",
  title: "UNB Collection",
  description:
    "Trazemos o streetwear para o campus da Universidade de Brasília",
  metadataBase: new URL(defaultUrl),
  keywords:
    "UNB Collection, streetwear, Universidade de Brasília, moda, campus, e-commerce, shopping, roupas, estudantes",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "UNB Collection",
    locale: "pt-BR",
    url: `${defaultUrl}`,
  },
};

export default function RootLayout({
  children,
  drawer,
  modal,
}: {
  children: React.ReactNode;
  drawer: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <body className="bg-[#efefef] text-foreground relative">
        {drawer}
        {modal}
        <Navbar />
        <main className="min-h-[90vh] flex flex-col">{children}</main>
        <WhatsAppButton />
        <Footer />
        <AutoLogin />
        <Toaster richColors theme="light" />
      </body>
      <Analytics />
      <Script src="https://accounts.google.com/gsi/client" async />
    </html>
  );
}
