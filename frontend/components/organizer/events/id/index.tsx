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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  QrCode,
  Download,
  Share2,
  Edit,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { mockEvents } from "@/lib/mock-data";
import { notFound, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ExternalLink } from "lucide-react"; 

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function EventDetailView({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const event = mockEvents.find((e) => e.id === params.id);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  if (!event) {
    notFound();
  }

  // Mock attendee data
  const attendees = Array.from({ length: event.checkInCount }, (_, i) => ({
    address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random()
      .toString(16)
      .slice(2, 6)}`,
    checkedInAt: new Date(event.startTime.getTime() + Math.random() * 3600000),
    transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
  }));

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeleteDialogOpen(false);
    router.push("/dashboard/organizer/events");
  };

  const handleExportAttendees = () => {
    const csvContent = [
      ["Address", "Checked In At", "Transaction Hash"],
      ...attendees.map((a) => [
        a.address,
        a.checkedInAt.toISOString(),
        a.transactionHash,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "-")}-attendees.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadQR = () => {
    // In a real app, you'd generate an actual QR code image
    // For now, we'll simulate the download
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = "#10b981";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("QR Code", 256, 256);
      ctx.fillText(event.title, 256, 286);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${event.title.replace(/\s+/g, "-")}-qr-code.png`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/check-in/${event.id}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/dashboard/organizer/events">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </Link>

      {/* Event Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-balance">{event.title}</h1>
            <Badge variant={event.isActive ? "default" : "secondary"}>
              {event.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(`/dashboard/organizer/events/${event.id}/edit`)
            }
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShareDialogOpen(true)}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.checkInCount}</div>
            <p className="text-xs text-muted-foreground">
              of {event.maxAttendees} capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.revenue} ETH</div>
            <p className="text-xs text-muted-foreground">
              {event.attendanceFee} ETH per attendee
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {event.startTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {event.startTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setMapDialogOpen(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{event.location}</div>
            <p className="text-xs text-primary">Click to view on map</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="qr-code">QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Start Time
                  </p>
                  <p className="text-lg font-semibold">
                    {event.startTime.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    End Time
                  </p>
                  <p className="text-lg font-semibold">
                    {event.endTime.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Max Attendees
                  </p>
                  <p className="text-lg font-semibold">{event.maxAttendees}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Attendance Fee
                  </p>
                  <p className="text-lg font-semibold">
                    {event.attendanceFee} ETH
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Organizer
                  </p>
                  <p className="text-lg font-semibold">
                    {event.organizerAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created
                  </p>
                  <p className="text-lg font-semibold">
                    {event.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                className="gradient-emerald-teal text-white hover:opacity-90"
                onClick={() => {
                  const tabsList = document.querySelector('[role="tablist"]');
                  const qrTab = tabsList?.querySelector(
                    '[value="qr-code"]'
                  ) as HTMLElement;
                  qrTab?.click();
                }}
              >
                <QrCode className="w-4 h-4 mr-2" />
                View QR Code
              </Button>
              <Button variant="outline" onClick={handleExportAttendees}>
                <Download className="w-4 h-4 mr-2" />
                Export Attendees
              </Button>
              <Button
                variant="outline"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Event
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendee List</CardTitle>
                  <CardDescription>
                    {event.checkInCount} attendees checked in
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportAttendees}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attendees.map((attendee, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{attendee.address}</p>
                        <p className="text-sm text-muted-foreground">
                          Checked in: {attendee.checkedInAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Link
                        href={`https://proofpass.app/check-in/${event.id}`}
                        target="_blank"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr-code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event QR Code</CardTitle>
              <CardDescription>
                Share this QR code for attendees to check in
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div
                ref={qrCodeRef}
                className="w-64 h-64 bg-white rounded-lg border-4 border-primary flex items-center justify-center"
              >
                <QrCode className="w-48 h-48 text-primary" />
              </div>
              <div className="flex gap-3">
                <Button
                  className="gradient-emerald-teal text-white hover:opacity-90"
                  onClick={handleDownloadQR}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                <Button variant="outline" onClick={handleCopyLink}>
                  {linkCopied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  {linkCopied ? "Link Copied!" : "Share Link"}
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Check-in URL</p>
                <p className="font-mono text-sm mt-1">
                  https://proofpass.app/check-in/{event.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{event.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Event</DialogTitle>
            <DialogDescription>
              Share this event with potential attendees
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Event Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }/check-in/${event.id}`}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button onClick={handleCopyLink}>
                  {linkCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=Check out ${event.title}&url=${window.location.origin}/check-in/${event.id}`,
                    "_blank"
                  )
                }
              >
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/check-in/${event.id}`,
                    "_blank"
                  )
                }
              >
                Share on Facebook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Event Location</DialogTitle>
            <DialogDescription>{event.location}</DialogDescription>
          </DialogHeader>
          <div className="h-[400px] rounded-lg overflow-hidden">
            {typeof window !== "undefined" && (
              <MapContainer
                center={[event.latitude, event.longitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[event.latitude, event.longitude]}>
                  <Popup>{event.title}</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
