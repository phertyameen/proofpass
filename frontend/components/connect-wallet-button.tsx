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
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const API_URL = "http://localhost:4000";

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<
    "organizer" | "attendee" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBaseApp, setIsBaseApp] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Wagmi hooks for browser wallet
  const { address, isConnected: isWalletConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect: disconnectWallet } = useDisconnect();

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedId =
      localStorage.getItem("fid") || localStorage.getItem("walletAddress");

    if (token && storedId) {
      setIdentifier(storedId);
      setIsConnected(true);
    }

    if (pathname.includes("/dashboard/organizer")) {
      setCurrentRole("organizer");
    } else if (pathname.includes("/dashboard/attendee")) {
      setCurrentRole("attendee");
    }
  }, [pathname]);

  // Auto-authenticate when wallet connects (for browser mode)
  useEffect(() => {
    if (isWalletConnected && address && !isConnected) {
      authenticateWithWallet(address);
    }
  }, [isWalletConnected, address, isConnected]);

  // Show RainbowKit ConnectButton for browser, or custom button for Base app
  useEffect(() => {
    sdk.context
      .then((ctx) => {
        if (ctx?.user?.fid) setIsBaseApp(true);
      })
      .catch(() => setIsBaseApp(false));
  }, []);
  
  // Authenticate with browser wallet using wagmi
  const authenticateWithWallet = async (walletAddress: string) => {
    try {
      setIsLoading(true);

      // Step 1: Get nonce
      const nonceResponse = await fetch(`${API_URL}/auth/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });

      if (!nonceResponse.ok) throw new Error("Failed to get nonce");

      const { nonce } = await nonceResponse.json();

      // Step 2: Sign message
      const message = `Sign this message to authenticate with ProofPass.\n\nWallet: ${walletAddress}\nNonce: ${nonce}`;
      const signature = await signMessageAsync({ message });

      // Step 3: Verify
      const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, signature, nonce }),
      });

      if (!verifyResponse.ok) throw new Error("Failed to verify signature");

      const { accessToken } = await verifyResponse.json();

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("walletAddress", walletAddress);
      setIdentifier(walletAddress);
      setIsConnected(true);
      router.push("/select-role");
    } catch (error) {
      console.error("Wallet authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Authenticate with Farcaster (for Base app)
  const authenticateWithFarcaster = async () => {
    try {
      setIsLoading(true);

      if (!sdk.context) {
        throw new Error("Not in Base app environment");
      }

      const context = await sdk.context;
      const userFid = context.user.fid;

      if (!userFid) throw new Error("No user found");

      // Step 1: Get nonce
      const nonceResponse = await fetch(`${API_URL}/auth/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid: userFid.toString() }),
      });

      if (!nonceResponse.ok) throw new Error("Failed to get nonce");

      const { nonce } = await nonceResponse.json();

      // Step 2: Sign in with Farcaster
      const signInResult = await sdk.actions.signIn({ nonce });

      // Step 3: Verify
      const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: userFid.toString(),
          signature: signInResult.signature,
          nonce,
        }),
      });

      if (!verifyResponse.ok) throw new Error("Failed to verify signature");

      const { accessToken } = await verifyResponse.json();

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("fid", userFid.toString());
      setIdentifier(userFid.toString());
      setIsConnected(true);
      router.push("/select-role");
    } catch (error) {
      console.error("Farcaster authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("fid");
    localStorage.removeItem("walletAddress");
    setIsConnected(false);
    setIdentifier(null);
    setCurrentRole(null);
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

  const handleConnect = async () => {
    // Check if in Base app environment
    try {
      const context = await sdk.context;
      if (context?.user?.fid) {
        await authenticateWithFarcaster();
      }
    } catch {
      // Not in Base app, RainbowKit will handle the connection
      // and useEffect will trigger authentication
    }
  };

  if (isConnected && identifier) {
    const displayText = identifier.startsWith("0x")
      ? `${identifier.slice(0, 6)}...${identifier.slice(-4)}`
      : `FID: ${identifier}`;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gradient-emerald-teal text-white hover:opacity-90 transition-opacity">
            <User className="w-4 h-4 mr-2" />
            {displayText}
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

  if (isBaseApp) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="gradient-emerald-teal text-white hover:opacity-90 transition-opacity"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isLoading ? "Connecting..." : "Connect with Farcaster"}
      </Button>
    );
  }
  return <ConnectButton />;
}
