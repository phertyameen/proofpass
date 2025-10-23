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
  const { getAllEventsWithMetadata, isConnected, connectWallet, account } =
    useEventContract();
  const [events, setEvents] = useState<EventWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "past">("all");

  useEffect(() => {
    if (isConnected && account) {
      console.log("Connected with account:", account);
      loadEvents();
    } else {
      setLoading(false);
    }
  }, [isConnected, account]);

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
    // Search filter
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const eventDate = new Date(event.startDate);
    const now = new Date();
    const isPast = eventDate < now;

    if (filter === "active") {
      return matchesSearch && event.isActive && !isPast;
    } else if (filter === "past") {
      return matchesSearch && isPast;
    }

    return matchesSearch;
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">
          Connect your wallet to view events
        </p>
        <Button
          onClick={connectWallet}
          className="gradient-emerald-teal text-white hover:opacity-90"
        >
          Connect Wallet
        </Button>
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
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-muted-foreground">
            {events.length === 0
              ? "No events found. Create your first event!"
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
