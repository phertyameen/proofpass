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
} from "lucide-react";
import Link from "next/link";
import { mockEvents } from "@/lib/mock-data";

export default function EventsView() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-balance">Events</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your events in one place
          </p>
        </div>
        <Link href="/dashboard/organizer/events/create">
          <Button className="gradient-emerald-teal text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-10" />
        </div>
        <Button variant="outline">All Events</Button>
        <Button variant="outline">Active</Button>
        <Button variant="outline">Past</Button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <Link key={event.id} href={`/dashboard/organizer/events/${event.id}`}>
            <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
              <div className="aspect-video w-full bg-gradient-to-br from-primary to-secondary rounded-t-lg flex items-center justify-center text-white text-4xl font-bold">
                {event.title.charAt(0)}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-balance">{event.title}</CardTitle>
                  <Badge variant={event.isActive ? "default" : "secondary"}>
                    {event.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {event.startTime.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">{event.checkInCount}</span>
                    <span className="text-muted-foreground">
                      / {event.maxAttendees}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-accent">
                    <DollarSign className="w-4 h-4" />
                    {event.revenue} ETH
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
