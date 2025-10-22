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
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import Link from "next/link";
import { mockEvents } from "@/lib/mock-data";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";

export default function EventsDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "free" | "paid">(
    "all"
  );

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "free" &&
        Number.parseFloat(event.attendanceFee) === 0) ||
      (selectedFilter === "paid" && Number.parseFloat(event.attendanceFee) > 0);

    return matchesSearch && matchesFilter && event.isActive;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-24 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-balance">Discover Events</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Find and attend events with blockchain-verified attendance
          </p>
        </div>

        {/* Search and Filters */}
        <div className=" mx-auto space-y-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search events by name, location, or description..."
              className="pl-12 h-11 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
            >
              All Events
            </Button>
            <Button
              variant={selectedFilter === "free" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("free")}
            >
              Free
            </Button>
            <Button
              variant={selectedFilter === "paid" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("paid")}
            >
              Paid
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "event" : "events"} found
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No Events Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {filteredEvents.map((event) => {
              const isFree = Number.parseFloat(event.attendanceFee) === 0;
              const capacityPercentage =
                (event.checkInCount / event.maxAttendees) * 100;
              const isAlmostFull = capacityPercentage >= 80;

              return (
                <Link key={event.id} href={`/check-in/${event.id}`}>
                  <Card className="hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer h-full pt-0">
                    <div className="aspect-video w-full bg-gradient-to-br from-primary to-secondary rounded-t-lg flex items-center justify-center text-white text-4xl font-bold relative overflow-hidden">
                      {event.title.charAt(0)}
                      {isAlmostFull && (
                        <Badge className="absolute top-3 right-3 bg-accent text-white">
                          Almost Full
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-balance line-clamp-2">
                          {event.title}
                        </CardTitle>
                        {isFree ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <Badge className="bg-accent text-white">
                            {event.attendanceFee} ETH
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {event.startTime.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {event.checkInCount}
                          </span>
                          <span className="text-muted-foreground">
                            / {event.maxAttendees}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="gradient-emerald-teal text-white hover:opacity-90"
                        >
                          Check In
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="gradient-emerald-teal text-white overflow-hidden relative">
            <CardContent className="py-12 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Want to Host Your Own Event?
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Create events with blockchain verification and reach thousands
                of attendees
              </p>
              <Link href="/dashboard/organizer/events/create">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Start Creating Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
