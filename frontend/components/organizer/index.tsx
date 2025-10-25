/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useEventContract } from "@/lib/hooks/useEventContract";
import { toast } from "sonner";
import { getWalletFromFID } from "@/lib/api/getWalletFromFID";
import FrameSDK from "@farcaster/frame-sdk";

interface EventWithMetadata {
  eventId: string;
  organizer: string;
  metadataHash: string;
  createdAt: number;
  attendanceFee: string;
  isActive: boolean;
  maxAttendees: number;
  currentAttendees: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export default function EventsView() {
  const [fid, setFid] = useState<string | null>(null);
  const [walletFromFid, setWalletFromFid] = useState<string | null>(null);
  const { getAllEventsWithMetadata, isConnected, connectWallet, account } =
    useEventContract();
  const [events, setEvents] = useState<EventWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "past">("all");

  // Detect if we're inside Farcaster frame
  useEffect(() => {
    const detectFid = async () => {
      try {
        const ctx = await FrameSDK.context;

        if (ctx?.user?.fid) {
          console.log("Farcaster context detected:", ctx.user.fid);
          setFid(ctx.user.fid.toString());
        } else {
          console.log("No Farcaster user detected.");
        }
      } catch (error) {
        console.error("Not in Farcaster frame or SDK error:", error);
      }
    };

    detectFid();
  }, []);

  // Resolve FID to wallet address via Neynar
  useEffect(() => {
    if (!fid) return;
    const resolveWallet = async () => {
      const wallet = await getWalletFromFID(fid);
      if (wallet) {
        setWalletFromFid(wallet);
        localStorage.setItem("farcasterWallet", wallet);
        toast.success("Farcaster wallet detected");
      } else {
        toast.warning("No wallet linked to this Farcaster account");
      }
    };
    resolveWallet();
  }, [fid]);

  // Fetch events (based on wallet)
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const activeWallet = walletFromFid || account;
        if (!activeWallet) {
          console.log("No wallet connected — skipping event fetch");
          setLoading(false);
          return;
        }

        const eventsList = await getAllEventsWithMetadata();
        setEvents(eventsList);
      } catch (err) {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [walletFromFid, account]);

  // UI handling
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (!walletFromFid && !isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <p className="text-gray-500 text-center">
          Connect your wallet to view events
        </p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-screen m-auto flex items-center md:justify-end gap-2">
        <p className="text-center text-gray-500">No events found.</p>
        <Link href="/dashboard/organizer/events/create">
          <Button className="gradient-emerald-teal text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>
    );
  }

  const loadEvents = async () => {
    if (!isConnected) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Loading events...");
      const eventData = await getAllEventsWithMetadata();
      console.log("Events loaded:", eventData);
      setEvents(eventData || []);

      if (eventData && eventData.length > 0) {
        toast(`Events loaded. Found ${eventData.length} event(s)`);
      }
    } catch (error: any) {
      console.error("Error loading events:", error);
      toast("Error loading events", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const now = new Date();
    const start = new Date(event.startDate + "T" + event.startTime);
    const end = new Date(event.endDate + "T" + event.endTime);

    if (filter === "active") {
      return matchesSearch && event.isActive && now >= start && now <= end;
    } else if (filter === "past") {
      return matchesSearch && now > end;
    }

    return matchesSearch;
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">
          {fid
            ? "Fetching your Farcaster-linked wallet..."
            : "Connect your wallet to view events"}
        </p>
        {!fid && (
          <Button
            onClick={connectWallet}
            className="gradient-emerald-teal text-white hover:opacity-90"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-0">
        <div className="m-auto w-screen">
          <h1 className="text-4xl font-bold text-balance">Events</h1>
          <p className="w-max text-muted-foreground mt-2">
            Manage all your events in one place
          </p>
          {account && (
            <p className="text-xs text-muted-foreground mt-1">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          )}
        </div>
        <div className="w-screen m-auto flex items-center md:justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Link href="/dashboard/organizer/events/create">
            <Button className="gradient-emerald-teal text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full relative flex justify-between">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full flex gap-4 md:gap-0 justify-between items-center">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Events
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "past" ? "default" : "outline"}
            onClick={() => setFilter("past")}
          >
            Past
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-muted-foreground">
            {events.length === 0
              ? "You don't have any active events. No worries, you can always create now!"
              : "No events match your search criteria"}
          </p>
          <Link href="/dashboard/organizer/events/create">
            <Button className="gradient-emerald-teal text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      ) : (
        /* Events Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const startDate = new Date(`${event.startDate}T${event.startTime}`);
            const revenue = (
              Number(event.attendanceFee) * event.currentAttendees
            ).toFixed(4);

            return (
              <Link
                key={event.eventId}
                href={`/dashboard/organizer/events/${event.eventId}`}
              >
                <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                  <div className="aspect-video w-full bg-gradient-to-br from-primary to-secondary rounded-t-lg flex items-center justify-center text-white text-4xl font-bold">
                    {event.title.charAt(0)}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-balance">
                        {event.title}
                      </CardTitle>
                      {(() => {
                        const now = new Date();
                        const start = new Date(
                          `${event.startDate}T${event.startTime}`
                        );
                        const end = new Date(
                          `${event.endDate}T${event.endTime}`
                        );

                        let status = "";
                        let variant: "default" | "secondary" | "outline" =
                          "default";

                        if (now < start) {
                          status = "Upcoming";
                          variant = "outline";
                        } else if (now >= start && now <= end) {
                          status = "Active";
                          variant = "default";
                        } else {
                          status = "Past";
                          variant = "secondary";
                        }

                        return <Badge variant={variant}>{status}</Badge>;
                      })()}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {startDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {event.currentAttendees}
                        </span>
                        <span className="text-muted-foreground">
                          / {event.maxAttendees}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-accent">
                        <DollarSign className="w-4 h-4" />
                        {revenue} ETH
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
