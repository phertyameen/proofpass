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
  ExternalLink,
  Download,
  Wallet,
} from "lucide-react";
import { mockAttendance } from "@/lib/mock-data";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import Link from "next/link";
import { useState } from "react";

export default function MyAttendancePage() {
  const [isConnected] = useState(true);
  const [mockAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view your attendance history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectWalletButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 pt-8 space-y-8">
        {/* <Link href="/dashboard/attendee">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link> */}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-balance">My Attendance</h1>
            <p className="text-muted-foreground mt-2">
              Your verified event attendance history
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Connected Wallet */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Connected Wallet
                </p>
                <p className="font-mono text-lg font-bold mt-1">
                  {mockAddress}
                </p>
              </div>
              <Badge className="gradient-emerald-teal text-white">
                {mockAttendance.length} Events Attended
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Attendance List */}
        {mockAttendance.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No Attendance Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start attending events to build your verified attendance history
              </p>
              <Link href="/events">
                <Button className="gradient-emerald-teal text-white hover:opacity-90">
                  Discover Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockAttendance.map((record, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                        {record.eventTitle.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-balance mb-2">
                          {record.eventTitle}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Event Date: {record.eventDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            Checked in: {record.checkedInAt.toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-accent/50">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Transaction Hash
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-sm truncate">
                              {record.transactionHash}
                            </p>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {record.nftTokenId && (
                        <Badge variant="secondary">
                          NFT #{record.nftTokenId}
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Certificate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
