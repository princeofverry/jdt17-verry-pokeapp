import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import QueryProvider from "@/providers/QueryProvider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 selection:bg-primary/30 font-sans">
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
