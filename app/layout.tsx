import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import QueryProvider from "@/providers/QueryProvider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pokemon Explorer - Pokedex Gacha & Collection",
  description: "Explore wild Pokemon species, try your luck with daily gacha ticket rolls, catch them with custom nicknames, and maintain your collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F3F4F6] text-black selection:bg-primary/50 font-sans">
        <QueryProvider>
          <Suspense fallback={<div className="h-14 bg-white border-b border-gray-100" />}>
            <Header />
          </Suspense>
          <main className="flex-1 flex flex-col w-full pb-14 sm:pb-0">
            {children}
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <Toaster position="top-center" closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
