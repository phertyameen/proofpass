"use client"

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { Stats } from "@/components/stats";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { useAccount } from "wagmi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";

export default function Home() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Check localStorage for wallet address or FID
      const storedWalletAddress = localStorage.getItem("walletAddress");
      const storedFid = localStorage.getItem("fid");

      // Check if in Farcaster/Base app environment
      let farcasterFid = null;
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          farcasterFid = context.user.fid.toString();
          localStorage.setItem("fid", farcasterFid);
        }
      } catch {
        // Not in Farcaster environment, continue
      }

      // If wallet is connected, store the address
      if (isConnected && address) {
        localStorage.setItem("walletAddress", address);
      }

      // Check if user is authenticated (has wallet or FID)
      const isAuthenticated = 
        isConnected || 
        storedWalletAddress || 
        storedFid || 
        farcasterFid;

      // Redirect to select-role if authenticated and not already on a protected page
      if (isAuthenticated && pathname === "/") {
        router.push("/select-role");
      } else {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [isConnected, address, pathname, router]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
