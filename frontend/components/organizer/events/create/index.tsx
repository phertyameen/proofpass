/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ImageIcon,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEventContract } from "@/lib/hooks/useEventContract";
import { sdk } from "@farcaster/miniapp-sdk";
import { toast } from "sonner";

export default function CreateEventView() {
  const router = useRouter();
  const { createEvent, isConnected, connectWallet, account, contract, signer } =
    useEventContract();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    maxAttendees: "",
    attendanceFee: "0",
  });
  const [isInitializing, setIsInitializing] = useState(true);
  const [fid, setFid] = useState<string | null>(null);
  const [isBaseApp, setIsBaseApp] = useState(false);

  useEffect(() => {
    const storedFid = localStorage.getItem("fid");
    if (storedFid) {
      setFid(storedFid);
      setIsBaseApp(true);
    }

    sdk.context
      .then((ctx) => {
        if (ctx?.user?.fid) {
          const fidString = ctx.user.fid.toString();
          setIsBaseApp(true);
          setFid(fidString);
          localStorage.setItem("fid", fidString);
        }
      })
      .catch(() => {
        if (!storedFid) {
          setIsBaseApp(false);
        }
      });
  }, []);

  // Wait for contract to initialize
  useEffect(() => {
    console.log("Contract state:", contract);
    console.log("Account state:", account);
    console.log("Signer state:", signer);
    console.log("isConnected:", isConnected);

    if (contract) {
      console.log("Contract initialized, setting isInitializing to false");
      setIsInitializing(false);
    } else {
      console.log("Contract not yet initialized");
    }

    // Add a timeout fallback - if contract doesn't initialize in 10 seconds, show form anyway
    const timeout = setTimeout(() => {
      console.log("Timeout reached, forcing initialization to false");
      setIsInitializing(false);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [contract, account, signer, isConnected]);

  // Wait for contract to initialize OR Farcaster wallet to be detected
  useEffect(() => {
    const farcasterWallet = localStorage.getItem("farcasterWallet");

    console.log("Checking initialization:", {
      contract: !!contract,
      account,
      farcasterWallet,
      fid,
      isConnected,
    });

    // If we have EITHER a contract OR a Farcaster wallet, we can proceed
    if (contract || farcasterWallet || account) {
      console.log("Ready to show form");
      setIsInitializing(false);
    }

    // Fallback timeout
    const timeout = setTimeout(() => {
      console.log("Timeout - showing form anyway");
      setIsInitializing(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [contract, account, fid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const farcasterWallet = localStorage.getItem("farcasterWallet");

    if (!isConnected && !fid && !farcasterWallet) {
      toast.error(
        "Wallet not connected. Please connect your wallet to create an event."
      );
      return;
    }

    if (!contract) {
      toast.error("Contract not initialized. Please wait...");
      return;
    }

    setIsCreating(true);

    try {
      const metadata = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
      };

      toast.info("Please approve the transaction in your wallet...");

      const result = await createEvent(
        metadata,
        formData.attendanceFee,
        parseInt(formData.maxAttendees)
      );

      toast.success(`Event created successfully! Event ID: ${result.eventId}`);

      router.push("/dashboard/organizer/events");
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(
        error.message || "An error occurred while creating the event."
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading state while contract initializes
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2">Initializing contract...</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isConnected && !fid) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 mt-8">
          <p className="text-muted-foreground">
            Connect your wallet to create an event
          </p>
          <Button
            onClick={connectWallet}
            className="gradient-emerald-teal text-white hover:opacity-90"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      {/* <Link href="/dashboard/organizer/events"> */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>
      {/* </Link> */}

      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-balance">Create Event</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new event with blockchain verification
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Web3 Developer Conference 2025"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event, what attendees can expect, and any special requirements..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="Lagos, Nigeria"
                    className="pl-10"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
              <CardDescription>
                When will your event take place?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="pl-10"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="pl-10"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Capacity & Pricing</CardTitle>
              <CardDescription>Set attendance limits and fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Maximum Attendees *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="maxAttendees"
                    name="maxAttendees"
                    type="number"
                    placeholder="500"
                    className="pl-10"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendanceFee">Attendance Fee (ETH)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="attendanceFee"
                    name="attendanceFee"
                    type="number"
                    step="0.001"
                    placeholder="0.01"
                    className="pl-10"
                    value={formData.attendanceFee}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Set to 0 for free events
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Event Image */}
          <Card>
            <CardHeader>
              <CardTitle>Event Image</CardTitle>
              <CardDescription>
                Upload a cover image for your event (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or GIF (max. 5MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gas Estimate */}
          <Card className="bg-accent/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estimated Gas Fee</p>
                  <p className="text-sm text-muted-foreground">
                    Transaction cost on Base network
                  </p>
                </div>
                <p className="text-2xl font-bold text-primary">~0.0001 ETH</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className=" bg-transparent"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-emerald-teal text-white hover:opacity-90"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Event...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
