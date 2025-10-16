"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, User, Settings, Users, UserCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [mockAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
  const [currentRole, setCurrentRole] = useState<"organizer" | "attendee" | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.includes("/dashboard/organizer")) {
      setCurrentRole("organizer")
      setIsConnected(true)
    } else if (pathname.includes("/dashboard/attendee")) {
      setCurrentRole("attendee")
      setIsConnected(true)
    }
  }, [pathname])

  const handleConnect = () => {
    setIsConnected(true)
    router.push("/select-role")
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setCurrentRole(null)
    router.push("/")
  }

  const handleSwitchRole = () => {
    if (currentRole === "organizer") {
      router.push("/dashboard/attendee")
    } else {
      router.push("/dashboard/organizer")
    }
  }

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gradient-emerald-teal text-white hover:opacity-90 transition-opacity">
            <User className="w-4 h-4 mr-2" />
            {mockAddress.slice(0, 6)}...{mockAddress.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {currentRole && (
            <>
              <DropdownMenuItem onClick={handleSwitchRole} className="cursor-pointer">
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

          <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gradient-emerald-teal text-white hover:opacity-90 transition-opacity">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleConnect} className="cursor-pointer">
          <Wallet className="w-4 h-4 mr-2" />
          Coinbase Wallet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleConnect} className="cursor-pointer">
          <Wallet className="w-4 h-4 mr-2" />
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleConnect} className="cursor-pointer">
          <Wallet className="w-4 h-4 mr-2" />
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
