import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Navbar } from "@/components/globals/navbar";
import { WhatsAppButton } from "@/components/globals/whatsapp";
import { Footer } from "@/components/globals/footer";
import { type Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  applicationName: "UNB Collection",
  title: "UNB Collection",
  description:
    "Trazemos o streetwear para o campus da Universidade de Brasília",
  metadataBase: new URL(defaultUrl),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: `${defaultUrl}`,
    images: `${defaultUrl}/img/supabase-og-image.png`,
  },
};

export default function RootLayout({
  children,
  drawer,
}: {
  children: React.ReactNode;
  drawer: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <body className="bg-[#f6f6f6] text-foreground">
        <Navbar />
        <main className="min-h-screen flex flex-col items-center pt-20">
          {drawer}
          {children}
          <WhatsAppButton />
        </main>
        <Footer />
      </body>
    </html>
  );
}
