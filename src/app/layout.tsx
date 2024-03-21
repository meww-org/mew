import type { Metadata } from "next";
import { Open_Sans } from 'next/font/google'
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";


const open_sans = Open_Sans({subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meww",
  description: "Helps developers write better code faster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-primary text-secondary">
      <body className={open_sans.className}>
        <Providers>
          <Header />
          {children}
          </Providers>
      </body>
    </html>
  );
}
