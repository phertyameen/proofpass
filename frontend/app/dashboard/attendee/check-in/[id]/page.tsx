"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  Wallet,
  ExternalLink,
} from "lucide-react";
import { mockEvents } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { useState } from "react";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import Link from "next/link";

export default function CheckInPage({ params }: { params: { id: string } }) {
  const [isConnected, setIsConnected] = useState(false);
  const [mockAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [txHash, setTxHash] = useState("");

  const event = mockEvents.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  const handleCheckIn = async () => {
    setIsCheckingIn(true);

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    setTxHash(mockTxHash);
    setCheckedIn(true);
    setIsCheckingIn(false);
  };

  const attendanceFeeNum = Number.parseFloat(event.attendanceFee);
  const isFree = attendanceFeeNum === 0;

  if (checkedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl">Check-In Successful!</CardTitle>
            <CardDescription>
              You&apos;ve been verified on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-accent/50 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Event</p>
              <p className="text-lg font-bold">{event.title}</p>
            </div>

            <div className="p-4 rounded-lg bg-accent/50 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Your Wallet
              </p>
              <p className="font-mono text-sm">{mockAddress}</p>
            </div>

            <div className="p-4 rounded-lg bg-accent/50 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Transaction Hash
              </p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm truncate">{txHash}</p>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/my-attendance">
                <Button className="w-full gradient-emerald-teal text-white hover:opacity-90">
                  View My Attendance
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="w-full bg-transparent">
                  Discover More Events
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl text-balance">
                {event.title}
              </CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </div>
            <Badge variant={event.isActive ? "default" : "secondary"}>
              {event.isActive ? "Active" : "Ended"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {event.startTime.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {event.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Attendance</p>
                <p className="text-sm text-muted-foreground">
                  {event.checkInCount} / {event.maxAttendees} checked in
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <DollarSign className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Attendance Fee</p>
                <p className="text-sm text-muted-foreground">
                  {isFree ? "Free" : `${event.attendanceFee} ETH`}
                </p>
              </div>
            </div>
          </div>

          {/* Check-In Section */}
          <div className="border-t border-border pt-6">
            {!isConnected ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-muted-foreground">
                    Connect your wallet to check in to this event
                  </p>
                </div>
                <div onClick={() => setIsConnected(true)}>
                  <ConnectWalletButton />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/50">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Connected Wallet
                  </p>
                  <p className="font-mono text-sm">{mockAddress}</p>
                </div>

                {!isFree && (
                  <div className="p-4 rounded-lg bg-accent/50 border-2 border-accent">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Total Amount</p>
                        <p className="text-sm text-muted-foreground">
                          Attendance fee + gas
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-accent">
                        ~{(attendanceFeeNum + 0.0001).toFixed(4)} ETH
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn || !event.isActive}
                  className="w-full gradient-emerald-teal text-white hover:opacity-90 h-12 text-lg"
                >
                  {isCheckingIn
                    ? "Checking In..."
                    : event.isActive
                    ? "Check In Now"
                    : "Event Ended"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By checking in, you agree to have your attendance verified on
                  the blockchain
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
