import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import Image from "next/image";
import { Suspense } from 'react';
import ProgressBar from "@/components/ProgressBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto_mono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cifras Cristao",
  description: "Cifras e tablaturas para músicos cristãos.",
  icons: {
    icon: '/assets/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto_mono.variable} antialiased bg-[var(--color-background)] text-[var(--color-text-primary)]`}
      >
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <header className="bg-[var(--color-card-background)] p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <a href="/" className="flex items-center gap-2">
              <Image src="/assets/logo.png" alt="Cifras Cristao Logo" width={40} height={40} />
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">Cifras Cristao</span>
            </a>
            <div>
                            <AuthButton />
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
