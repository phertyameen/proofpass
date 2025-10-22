import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Suspense } from "react";
import { MiniAppProvider } from "@/components/miniapp-provider";
import { WalletProvider } from "@/providers/wallet-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProofPass - Where Proof Meets Profit",
  description:
    "Blockchain-powered event attendance verification. Transform your events with verifiable attendance, seamless check-ins, and powerful analytics.",
  icons: {
    icon: "/icon.png",
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://proofpass-pi.vercel.app/icon.png",
      button: {
        title: "Launch ProofPass",
        action: {
          type: "launch_miniapp",
          name: "ProofPass",
          url: "https://proofpass-pi.vercel.app/",
          splashImageUrl: "https://proofpass-pi.vercel.app/icon.png",
          splashBackgroundColor: "#10b981",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <MiniAppProvider>
          <WalletProvider>
            <AuthProvider>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </AuthProvider>
          </WalletProvider>
          <Analytics />
        </MiniAppProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
