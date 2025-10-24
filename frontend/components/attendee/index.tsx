"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  Search,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

const ATTENDANCE_VERIFIER_ADDRESS = process.env
  .NEXT_PUBLIC_ATTENDANCE_VERIFIER_ADDRESS as `0x${string}`;

const ATTENDANCE_ABI = [
  {
    inputs: [{ name: "_attendee", type: "address" }],
    name: "getAttendeeHistory",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_eventId", type: "uint256" },
      { name: "_attendee", type: "address" },
    ],
    name: "attendances",
    outputs: [
      { name: "eventId", type: "uint256" },
      { name: "attendee", type: "address" },
      { name: "timestamp", type: "uint256" },
      { name: "verified", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const EVENT_ABI = [
  {
    inputs: [{ name: "_eventId", type: "uint256" }],
    name: "getEvent",
    outputs: [
      {
        components: [
          { name: "eventId", type: "uint256" },
          { name: "organizer", type: "address" },
          { name: "metadataHash", type: "string" },
          { name: "createdAt", type: "uint256" },
          { name: "attendanceFee", type: "uint256" },
          { name: "isActive", type: "bool" },
          { name: "maxAttendees", type: "uint256" },
          { name: "currentAttendees", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function AttendeeDashboardView() {
  const { address } = useAccount();
  const [attendedEvents, setAttendedEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get attendee history
  const { data: eventIds } = useReadContract({
    address: ATTENDANCE_VERIFIER_ADDRESS,
    abi: ATTENDANCE_ABI,
    functionName: "getAttendeeHistory",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventIds || eventIds.length === 0) {
        setIsLoading(false);
        return;
      }

      const events = await Promise.all(
        (eventIds as bigint[]).map(async (eventId) => {
          try {
            // Fetch event data
            const eventResponse = await fetch(`/api/events/${eventId}`);
            const eventData = await eventResponse.json();

            // Fetch metadata
            const metadataResponse = await fetch(
              `/api/metadata/${eventData.metadataHash}`
            );
            const metadata = await metadataResponse.json();

            // Fetch attendance data
            const attendanceResponse = await fetch(
              `/api/attendance/${eventId}/${address}`
            );
            const attendance = await attendanceResponse.json();

            return {
              id: eventId.toString(),
              title: metadata.title,
              date: new Date(Number(attendance.timestamp) * 1000),
              location: metadata.location,
              verified: attendance.verified,
              nftMinted: true, // You can add NFT minting logic
            };
          } catch (error) {
            console.error(`Error fetching event ${eventId}:`, error);
            return null;
          }
        })
      );

      setAttendedEvents(events.filter(Boolean));
      setIsLoading(false);
    };

    fetchEventDetails();
  }, [eventIds, address]);

  // Calculate stats
  const thisMonthEvents = attendedEvents.filter((e: any) => {
    const now = new Date();
    return (
      e.date.getMonth() === now.getMonth() &&
      e.date.getFullYear() === now.getFullYear()
    );
  }).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col-reverse md:flex-row items-start gap-3 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-balance">
            Attendee Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Your event attendance history and NFTs
          </p>
        </div>
        <Link href="/events">
          <Button className="gradient-emerald-teal text-white hover:opacity-90">
            <Search className="w-4 h-4 mr-2" />
            Discover Events
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Events Attended
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendedEvents.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Proofs
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendedEvents.filter((e) => e.verified).length}
            </div>
            <p className="text-xs text-muted-foreground">On blockchain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              NFTs Collected
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendedEvents.filter((e) => e.nftMinted).length}
            </div>
            <p className="text-xs text-muted-foreground">Unique badges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Events attended</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row items-start sm:items-center justify-between">
            <div>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Your latest event check-ins</CardDescription>
            </div>
            <Link href="/dashboard/attendee/my-attendance">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendedEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row items-start md:items-center justify-between py-4 px-1 md:px-4 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center sm:gap-4">
                  <div className="w-6 h-6 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {event.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-balance">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.date.toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {event.verified && (
                    <Badge variant="default" className="bg-primary">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {event.nftMinted && (
                    <Badge variant="secondary" className="bg-accent text-white">
                      <Award className="w-3 h-3 mr-1" />
                      NFT
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/events">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Search className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Discover Events</CardTitle>
              <CardDescription>Find exciting events to attend</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/attendee/my-attendance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Calendar className="w-8 h-8 text-secondary mb-2" />
              <CardTitle>My Attendance</CardTitle>
              <CardDescription>
                View your complete attendance history
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/attendee/verify">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CheckCircle2 className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Verify Proof</CardTitle>
              <CardDescription>Verify attendance on blockchain</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
