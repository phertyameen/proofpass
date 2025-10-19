import type React from "react";
import { DashboardHeader } from "@/components/dashboard-header";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role="organizer" />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
