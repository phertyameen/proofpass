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
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { mockEvents } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { useEventContract } from "@/lib/hooks/useEventContract";

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

export default function OrganizerDashboardView() {
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

  const activeEvents = mockEvents.filter((e) => e.isActive);
  const totalCheckIns = mockEvents.reduce((sum, e) => sum + e.checkInCount, 0);
  const totalRevenue = mockEvents.reduce(
    (sum, e) => sum + Number.parseFloat(e.revenue),
    0
  );

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Connect your wallet to view dashboard</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-balance">
            Organizer Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your events and track attendance
          </p>
        </div>
        <Link href="/dashboard/organizer/events/create">
          <Button className="gradient-emerald-teal text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeEvents.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Check-ins
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCheckIns}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toFixed(4)} ETH
            </div>
            <p className="text-xs text-muted-foreground">
              From attendance fees
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
            <div className="text-2xl font-bold">
              {events.length > 0
                ? Math.round(totalCheckIns / mockEvents.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per event</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Your latest event activity</CardDescription>
            </div>
            <Link href="/dashboard/organizer/events">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No events yet</p>
              <Link href="/dashboard/organizer/events/create">
                <Button className="gradient-emerald-teal text-white hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              </Link>
            </div>
          ) : (
          <div className="space-y-4">
              {events.slice(0, 3).map((event) => {
                const startDate = new Date(`${event.startDate}T${event.startTime}`);
                const revenue = (Number(event.attendanceFee) * event.currentAttendees).toFixed(4);

                return (
                  <Link
                    key={event.eventId}
                    href={`/dashboard/organizer/events/${event.eventId}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
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
                          {startDate.toLocaleDateString()} • {event.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {event.currentAttendees} check-ins
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {revenue} ETH
                        </p>
                      </div>
                      <Badge variant={event.isActive ? "default" : "secondary"}>
                        {event.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/organizer/events/create">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Calendar className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Create Event</CardTitle>
              <CardDescription>
                Set up a new event with blockchain verification
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/organizer/events">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Users className="w-8 h-8 text-secondary mb-2" />
              <CardTitle>View Attendees</CardTitle>
              <CardDescription>
                See who checked in to your events
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/organizer/analytics">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track performance and insights</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
