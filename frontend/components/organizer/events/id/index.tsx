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
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useEventContract } from "@/lib/hooks/useEventContract";
import { toast } from "sonner";
import QRCodeStyling from "qr-code-styling";
import QRCode from "@/components/qrCode";

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
  latitude?: number;
  longitude?: number;
}

export default function EventDetailView({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { getEvent, getMetadata, toggleEventStatus, isConnected } =
    useEventContract();
  const [event, setEvent] = useState<EventWithMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [checkInUrl, setCheckInUrl] = useState<string>("");

  // Load event data
  useEffect(() => {
    if (isConnected) {
      loadEventData();
    }
  }, [isConnected, params.id]);

  // Initialize QR Code
  //   useEffect(() => {
  //     if (typeof window === "undefined") return;
  //     if (!event?.eventId || !qrCodeRef.current) return;

  //     const checkInUrl = `${window.location.origin}/dasboard/organizer/events/${event.eventId}`;

  //     if (!qrCode.current) {
  //       qrCode.current = new QRCodeStyling({
  //         width: 256,
  //         height: 256,
  //         data: checkInUrl,
  //         dotsOptions: { color: "#10b981", type: "rounded" },
  //         backgroundOptions: { color: "#ffffff" },
  //         cornersSquareOptions: { type: "extra-rounded" },
  //         cornersDotOptions: { type: "dot" },
  //       });
  //       qrCode.current.append(qrCodeRef.current);
  //     } else {
  //       qrCode.current.update({ data: checkInUrl });
  //     }
  //   }, [event?.eventId]);

  useEffect(() => {
    if (typeof window !== "undefined" && event?.eventId) {
      // This URL should point to the attendee check-in page, not organizer dashboard
      const url = `${window.location.origin}/dashboard/attendee/check-in/${event.eventId}`;
      setCheckInUrl(url);
    }
  }, [event?.eventId]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      const eventData = await getEvent(params.id);
      const metadata = await getMetadata(eventData.metadataHash);
      setEvent({ ...eventData, ...metadata });
    } catch (error) {
      console.error("Error loading event:", error);
      toast.error("Failed to load event data");
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!event) return;

    try {
      setIsTogglingStatus(true);
      await toggleEventStatus(event.eventId);
      toast.success(
        `Event ${event.isActive ? "deactivated" : "activated"} successfully`
      );
      await loadEventData(); // Reload to get updated status
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to toggle event status");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // TODO: Implement actual delete functionality
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeleteDialogOpen(false);
    toast.success("Event deleted successfully");
    router.push("/dashboard/organizer/events");
  };

  const handleExportAttendees = () => {
    if (!event) return;

    // Mock attendees - in production, fetch from blockchain
    const attendees = Array.from(
      { length: event.currentAttendees },
      (_, i) => ({
        address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random()
          .toString(16)
          .slice(2, 6)}`,
        checkedInAt: new Date(Date.now() - Math.random() * 3600000),
        transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      })
    );

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
    if (!checkInUrl) return;

    // Create a temporary canvas to capture the QR code
    const qrElement = document.querySelector("[data-qr-code]");
    if (!qrElement) return;

    // Use html2canvas or similar library in production
    // For now, just show a toast
    toast.info("QR Code download - implement with html2canvas or similar");
  };

  const handleCopyLink = () => {
    if (!checkInUrl || !event) return;

    navigator.clipboard.writeText(checkInUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  // Calculate revenue
  const revenue = (
    Number(event.attendanceFee) * event.currentAttendees
  ).toFixed(4);

  // Parse dates
  const startDateTime = new Date(`${event.startDate}T${event.startTime}`);
  const endDateTime = new Date(`${event.endDate}T${event.endTime}`);
  const isPastEvent = endDateTime < new Date();

  // Mock attendees for display
  const attendees = Array.from({ length: event.currentAttendees }, (_, i) => ({
    address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random()
      .toString(16)
      .slice(2, 6)}`,
    checkedInAt: new Date(startDateTime.getTime() + Math.random() * 3600000),
    transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
  }));

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      {/* Event Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-balance">{event.title}</h1>
            <Badge
              variant={event.isActive && !isPastEvent ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={handleToggleStatus}
            >
              {isTogglingStatus ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : null}
              {isPastEvent ? "Past" : event.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{event.description}</p>
          <p className="text-xs text-muted-foreground">
            Event ID: {event.eventId} | Created:{" "}
            {new Date(event.createdAt * 1000).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={isTogglingStatus || isPastEvent}
          >
            {isTogglingStatus ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {event.isActive ? "Deactivate" : "Activate"}
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
            <div className="text-2xl font-bold">{event.currentAttendees}</div>
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
            <div className="text-2xl font-bold">{revenue} ETH</div>
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
              {startDateTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {startDateTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${
            event.latitude && event.longitude
              ? "cursor-pointer hover:shadow-lg"
              : ""
          } transition-shadow`}
          onClick={() => {
            if (event.latitude && event.longitude) {
              setMapDialogOpen(true);
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{event.location}</div>
            {event.latitude && event.longitude && (
              <p className="text-xs text-primary">Click to view on map</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">
            Attendees ({event.currentAttendees})
          </TabsTrigger>
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
                    {startDateTime.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    End Time
                  </p>
                  <p className="text-lg font-semibold">
                    {endDateTime.toLocaleString()}
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
                  <p className="text-sm font-mono">{event.organizer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Metadata Hash
                  </p>
                  <p className="text-sm font-mono break-all">
                    {event.metadataHash}
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
                    {event.currentAttendees} attendees checked in
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportAttendees}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {event.currentAttendees === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attendees have checked in yet
                </div>
              ) : (
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
                          <p className="font-medium font-mono">
                            {attendee.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Checked in: {attendee.checkedInAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`https://etherscan.io/tx/${attendee.transactionHash}`}
                          target="_blank"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
              {checkInUrl ? (
                <div
                  data-qr-code
                  className="p-4 bg-white rounded-lg border-4 border-primary shadow-lg"
                >
                  <QRCode data={checkInUrl} width={256} />
                </div>
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  className="gradient-emerald-teal text-white hover:opacity-90"
                  onClick={handleDownloadQR}
                  disabled={!checkInUrl}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  disabled={!checkInUrl}
                >
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
                <p className="font-mono text-sm mt-1 break-all px-4">
                  {checkInUrl}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
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

      {/* Share Dialog */}
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
                  value={checkInUrl || "Loading..."}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button onClick={handleCopyLink} disabled={!checkInUrl}>
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
                    `https://twitter.com/intent/tweet?text=Check out ${event.title}&url=${window.location.origin}/check-in/${event.eventId}`,
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
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/check-in/${event.eventId}`,
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

      {/* Map Dialog */}
      {event.latitude && event.longitude && (
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
      )}
    </div>
  );
}
