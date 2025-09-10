import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'; // Import toastify css
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import AuthButton from "@/components/AuthButton";
import Image from "next/image";
import { Suspense } from 'react';
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto_mono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cifra Católica",
  description: "Cifras e tablaturas para músicos católicos.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Lora:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${roboto_mono.variable} antialiased bg-[var(--color-background)] text-[var(--color-text-primary)]`}
      >
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
         <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark" // Or "light" or "colored"
        />
        <header className="bg-[var(--color-card-background)] p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/assets/logo.png" alt="Cifra Católica Logo" width={40} height={40} />
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">Cifra Católica</span>
              </Link>
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