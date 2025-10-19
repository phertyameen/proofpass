"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SelectRoleView() {
  const router = useRouter();

  const handleRoleSelection = (role: "organizer" | "attendee") => {
    // Store role in localStorage for now (will be replaced with blockchain later)
    localStorage.setItem("userRole", role);

    if (role === "organizer") {
      router.push("/dashboard/organizer");
    } else {
      router.push("/dashboard/attendee");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-balance">
              Choose Your Role
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Select how you want to use ProofPass. You can switch roles
              anytime.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Organizer Card */}
            <Card className="hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer border-2 hover:border-primary">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Event Organizer</CardTitle>
                <CardDescription className="text-base">
                  Create and manage events with blockchain verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Create unlimited events with custom settings
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Track attendance with blockchain verification
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Generate QR codes for easy check-ins
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Access detailed analytics and revenue tracking
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Manage attendee lists and export data
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full gradient-emerald-teal text-white hover:opacity-90 h-12 text-lg"
                  onClick={() => handleRoleSelection("organizer")}
                >
                  Continue as Organizer
                </Button>
              </CardContent>
            </Card>

            {/* Attendee Card */}
            <Card className="hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer border-2 hover:border-secondary">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Event Attendee</CardTitle>
                <CardDescription className="text-base">
                  Discover and attend events with verified proof of attendance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Browse and discover exciting events
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Check in with QR codes or wallet address
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Get blockchain-verified proof of attendance
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      View your attendance history and NFTs
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Share your verified attendance on social media
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-lg"
                  onClick={() => handleRoleSelection("attendee")}
                >
                  Continue as Attendee
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Note */}
          {/* <Card className="bg-muted/50 border-none">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                You can switch between roles anytime from your dashboard
                settings
              </p>
            </CardContent>
          </Card> */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
