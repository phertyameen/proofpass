"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { WalletLogin } from "@/components/auth/WalletLogin";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useChainSwitcher } from "@/hooks/useChainSwitcher";


export default function LoginPage() {
  const { isConnected } = useAccount();
  const { isAuthenticated, isLoading } = useAuth();
  const { isCorrectChain, switchToLiskSepolia, isSwitching } =
    useChainSwitcher();
  const [userType, setUserType] = useState<"Attendee" | "Organizer" | null>(
    null
  );
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-proofpass-emerald"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-proofpass-emerald to-proofpass-teal flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-proofpass-gradient">
            ProofPass
          </h1>
          <p className="text-gray-600 mt-2">Where Proof Meets Profit</p>
        </div>

        {/* Connect Wallet Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
            <p className="text-gray-600 text-sm">
              Connect your wallet to get started
            </p>
          </div>

          {/* Rainbow Kit Connect Button */}
          <div className="flex justify-center">
            {/* <ConnectButton
              chainStatus="icon"
              accountStatus="address"
              showBalance={false}
            /> */}
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, mounted }) => {
                const connected = mounted && account && chain;
                return (
                  <div
                    {...(!mounted && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {!connected ? (
                      <Button onClick={openConnectModal}>Connect Wallet</Button>
                    ) : (
                      <button
                        onClick={openConnectModal}
                        className="px-4 py-2 rounded-lg font-medium text-white
                       bg-gradient-to-r from-[rgb(28,60,138)] via-white/70 to-[#02B7D5]
                        shadow-md hover:opacity-90 transition"
                      >
                        {account.displayName}
                      </button>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
            <div className="text-xs text-muted-foreground text-center bg-blue-50 p-2 rounded"></div>
          </div>
          <div>
            <strong>Note:</strong> This app requires connection to Base Sepolia
            network
          </div>

          {isConnected && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Next Step</span>
                </div>
              </div>

              <WalletLogin />
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">
            Why do I need to sign a message?
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Signing proves you own this wallet address. This is a secure,
            gas-free authentication method that doesn't require passwords. Your
            signature is verified on our server and you'll receive a session
            token.
          </p>
        </div>
      </div>
    </div>
  );
}
