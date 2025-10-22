import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function AttendeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role="attendee" />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
