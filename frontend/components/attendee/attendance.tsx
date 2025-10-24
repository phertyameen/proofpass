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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useEventContract } from "@/lib/hooks/useEventContract";
import { useAttendanceContract } from "@/hooks/useAttendanceContract";

interface AttendanceWithEvent {
  eventId: number;
  attendee: string;
  checkedInAt: number;
  nftTokenId: number;
  hasNFT: boolean;
  eventTitle: string;
  eventDate: Date;
  location: string;
  transactionHash: string;
}

export default function MyAttendancePage() {
  const { isConnected, account, connectWallet, getMyAttendance } = useAttendanceContract();
  const { getEvent, getMetadata } = useEventContract();
  const [attendance, setAttendance] = useState<AttendanceWithEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && account) {
      loadAttendance();
    } else {
      setLoading(false);
    }
  }, [isConnected, account]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      console.log('Loading attendance records...');
      
      const records = await getMyAttendance();
      console.log('Attendance records:', records);

      // Fetch event details for each attendance record
      const attendanceWithEvents = await Promise.all(
        records.map(async (record: any) => {
          try {
            const eventData = await getEvent(record.eventId);
            const metadata = await getMetadata(eventData.metadataHash);
            
            return {
              ...record,
              eventTitle: metadata.title,
              eventDate: new Date(`${metadata.startDate}T${metadata.startTime}`),
              location: metadata.location,
              transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`, // Mock for now
            };
          } catch (err) {
            console.error(`Error loading event ${record.eventId}:`, err);
            return null;
          }
        })
      );

      const validAttendance = attendanceWithEvents.filter((a: any) => a !== null) as AttendanceWithEvent[];
      setAttendance(validAttendance);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleExportAll = () => {
    const csvContent = [
      ['Event', 'Date', 'Location', 'Check-in Time', 'NFT Token ID', 'Transaction Hash'],
      ...attendance.map((record) => [
        record.eventTitle,
        record.eventDate.toLocaleDateString(),
        record.location,
        new Date(record.checkedInAt * 1000).toLocaleString(),
        record.hasNFT ? record.nftTokenId : 'N/A',
        record.transactionHash,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-attendance.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          <CardContent className="flex justify-center items-center">
            <Button
              onClick={connectWallet}
              className="gradient-emerald-teal text-white hover:opacity-90"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-balance">
              My Attendance
            </h1>
            <p className="text-muted-foreground mt-2">
              Your verified event attendance history
            </p>
          </div>
          {attendance.length > 0 && (
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          )}
        </div>

        {/* Connected Wallet */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row items-start lg:items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Connected Wallet
                </p>
                <p className="font-mono text-lg font-bold mt-1">
                  <span className="block sm:hidden">
                    {formatAddress(account)}
                  </span>
                  <span className="hidden sm:block">{account}</span>
                </p>
              </div>
              <Badge className="gradient-emerald-teal text-white">
                {attendance.length} Events Attended
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading attendance records...</p>
          </div>
        ) : attendance.length === 0 ? (
          /* Empty State */
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
          /* Attendance List */
          <div className="space-y-4">
            {attendance.map((record, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {record.eventTitle.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-balance mb-2">
                          {record.eventTitle}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            Event Date: {record.eventDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            {record.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            Checked in:{' '}
                            {new Date(record.checkedInAt * 1000).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-accent/50">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Transaction Hash
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-mono text-sm truncate">
                              {record.transactionHash}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `https://sepolia.basescan.org/tx/${record.transactionHash}`,
                                  '_blank'
                                )
                              }
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col gap-2">
                      {record.hasNFT && (
                        <Badge variant="secondary">NFT #{record.nftTokenId}</Badge>
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