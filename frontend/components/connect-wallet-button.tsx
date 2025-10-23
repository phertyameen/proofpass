"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wallet,
  LogOut,
  User,
  Settings,
  Users,
  UserCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectWalletButton() {
  const [currentRole, setCurrentRole] = useState<
    "organizer" | "attendee" | null
  >(null);
  const [isBaseApp, setIsBaseApp] = useState(false);
  const [fid, setFid] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Wagmi hooks for browser wallet
  const { address, isConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();

  // Determine current role based on pathname
  useEffect(() => {
    if (pathname.includes("/dashboard/organizer")) {
      setCurrentRole("organizer");
    } else if (pathname.includes("/dashboard/attendee")) {
      setCurrentRole("attendee");
    } else {
      setCurrentRole(null);
    }
  }, [pathname]);

  // Check if in Base app environment and get FID
  useEffect(() => {
    sdk.context
      .then((ctx) => {
        if (ctx?.user?.fid) {
          setIsBaseApp(true);
          setFid(ctx.user.fid.toString());
          localStorage.setItem("fid", ctx.user.fid.toString());
        }
      })
      .catch(() => setIsBaseApp(false));
  }, []);

  // Auto-redirect to role selection when wallet connects
  useEffect(() => {
    if (isConnected && address && !currentRole) {
      // Store wallet address
      localStorage.setItem("walletAddress", address);
      // Only redirect if not already on a dashboard page
      if (!pathname.includes("/dashboard") && !pathname.includes("/select-role")) {
        router.push("/select-role");
      }
    }
  }, [isConnected, address, currentRole, pathname, router]);

  const handleDisconnect = () => {
    localStorage.removeItem("fid");
    localStorage.removeItem("walletAddress");
    setCurrentRole(null);
    setFid(null);
    disconnectWallet();
    router.push("/");
  };

  const handleSwitchRole = () => {
    if (currentRole === "organizer") {
      router.push("/dashboard/attendee");
    } else {
      router.push("/dashboard/organizer");
    }
  };

  const handleFarcasterConnect = async () => {
    try {
      const context = await sdk.context;
      if (context?.user?.fid) {
        setFid(context.user.fid.toString());
        localStorage.setItem("fid", context.user.fid.toString());
        router.push("/select-role");
      }
    } catch (error) {
      console.error("Farcaster connection error:", error);
    }
  };

  // Get display identifier
  const getIdentifier = () => {
    if (fid) return `FID: ${fid}`;
    if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return null;
  };

  const identifier = getIdentifier();

  // If connected (either via wallet or Farcaster), show user menu
  if ((isConnected && address) || fid) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gradient-emerald-teal text-white hover:opacity-90 transition-opacity">
            <User className="w-4 h-4 mr-2" />
            {identifier}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {currentRole && (
            <>
              <DropdownMenuItem
                onClick={handleSwitchRole}
                className="cursor-pointer"
              >
                {currentRole === "organizer" ? (
                  <>
                    <UserCircle className="w-4 h-4 mr-2" />
                    Switch to Attendee
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Switch to Organizer
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="cursor-pointer"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleDisconnect}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If in Base app, show Farcaster connect button
  if (isBaseApp) {
    return (
      <Button
        onClick={handleFarcasterConnect}
        className="gradient-emerald-teal text-white hover:opacity-90 transition-opacity"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect with Farcaster
      </Button>
    );
  }

  // Default: Show RainbowKit connect button
  return (
    <div className="w-max m-auto pb-3">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                // 1. User is not connected
                if (!connected) {
                  return (
                    <Button
                      onClick={openConnectModal}
                      className="px-4 py-2 rounded-lg font-medium text-white
                        bg-gradient-to-r from-[rgb(28,60,138)] via-white/70 to-[#02B7D5]
                        hover:opacity-90 transition shadow-md"
                    >
                      Connect Wallet
                    </Button>
                  );
                }

                // 2. User is on the wrong network
                if (chain.unsupported) {
                  return (
                    <Button
                      onClick={openChainModal}
                      variant="destructive"
                      className="px-4 py-2 rounded-lg font-medium"
                    >
                      Wrong network
                    </Button>
                  );
                }

                // 3. User is connected and on the right network
                return (
                  <button
                    onClick={openAccountModal}
                    className="px-4 py-2 rounded-lg font-medium text-white
                      bg-gradient-to-r from-[rgb(28,60,138)] via-white/70 to-[#02B7D5]
                      shadow-md hover:opacity-90 transition"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}