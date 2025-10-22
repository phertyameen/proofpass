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
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AttendeeDashboardView() {
  // Mock attendee data
  const attendedEvents = [
    {
      id: "1",
      title: "Web3 Developer Conference 2025",
      date: new Date("2025-03-15"),
      location: "Lagos, Nigeria",
      verified: true,
      nftMinted: true,
    },
    {
      id: "2",
      title: "NFT Art Gallery Opening",
      date: new Date("2025-02-20"),
      location: "Abuja, Nigeria",
      verified: true,
      nftMinted: true,
    },
    {
      id: "3",
      title: "Startup Pitch Night",
      date: new Date("2025-01-10"),
      location: "Port Harcourt, Nigeria",
      verified: true,
      nftMinted: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-balance">
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
          <div className="flex items-center justify-between">
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
