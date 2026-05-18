import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Walima Techno — Gestion de salon de coiffure",
  description: "Application de facturation et gestion pour salons de coiffure africains",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Walima",
  },
  icons: {
    apple: "/icon-apple.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B2255",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
