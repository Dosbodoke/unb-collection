import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Navbar } from "@/components/globals/navbar";
import { WhatsAppButton } from "@/components/globals/whatsapp";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
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
      <body className="bg-background text-foreground">
        <Navbar />
        <main className="min-h-screen flex flex-col items-center pt-20">
          {drawer}
          {children}
          <WhatsAppButton />
        </main>
      </body>
    </html>
  );
}
