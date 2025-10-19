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
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { mockEvents } from "@/lib/mock-data";

export default function OrganizerDashboardView() {
  const activeEvents = mockEvents.filter((e) => e.isActive);
  const totalCheckIns = mockEvents.reduce((sum, e) => sum + e.checkInCount, 0);
  const totalRevenue = mockEvents.reduce(
    (sum, e) => sum + Number.parseFloat(e.revenue),
    0
  );

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
            <div className="text-2xl font-bold">{mockEvents.length}</div>
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
              {totalRevenue.toFixed(3)} ETH
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
              {mockEvents.length > 0
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
          <div className="space-y-4">
            {mockEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/organizer/events/${event.id}`}
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
                      {event.startTime.toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {event.checkInCount} check-ins
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.revenue} ETH
                    </p>
                  </div>
                  <Badge variant={event.isActive ? "default" : "secondary"}>
                    {event.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
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
  );
}
