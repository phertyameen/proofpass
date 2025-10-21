"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { mockEvents } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { useEventContract } from "@/lib/hooks/useEventContract";
import { Button } from "@/components/ui/button";

interface EventWithMetadata {
  eventId: number;
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

export default function AnalyticsView() {
  const { getAllEventsWithMetadata, isConnected, connectWallet } = useEventContract();
  const [events, setEvents] = useState<EventWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [isConnected]);

  const loadEvents = async () => {
    if (!isConnected) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const eventData = await getAllEventsWithMetadata();
      setEvents(eventData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalCheckIns = events.reduce((sum, e) => sum + e.currentAttendees, 0);
  const totalRevenue = events.reduce(
    (sum, e) => sum + Number(e.attendanceFee) * e.currentAttendees,
    0
  );
  const avgAttendance =
    events.length > 0 ? Math.round(totalCheckIns / events.length) : 0;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Connect your wallet to view analytics</p>
        <Button
          onClick={connectWallet}
          className="gradient-emerald-teal text-white hover:opacity-90"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-balance">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your event performance and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attendees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCheckIns}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">23%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toFixed(3)} ETH
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">18%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendance}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDown className="w-3 h-3 text-red-500" />
              <span className="text-red-500">5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Check-ins Over Time</CardTitle>
            <CardDescription>
              Daily check-in trends for the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart visualization coming soon
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Event</CardTitle>
            <CardDescription>Top performing events by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart visualization coming soon
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
          <CardDescription>Detailed breakdown of each event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {event.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-balance">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.startTime.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{event.checkInCount}</p>
                    <p className="text-xs text-muted-foreground">Attendees</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">
                      {event.revenue}
                    </p>
                    <p className="text-xs text-muted-foreground">ETH</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {Math.round(
                        (event.checkInCount / event.maxAttendees) * 100
                      )}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
