"use client";

import Link from "next/link";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Menu,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export function DashboardHeader({ role }: { role: "organizer" | "attendee" }) {
  const [open, setOpen] = useState(false);

  const organizerNavigation = [
    { name: "Dashboard", href: "/dashboard/organizer", icon: LayoutDashboard },
    { name: "Events", href: "/dashboard/organizer/events", icon: Calendar },
    {
      name: "Analytics",
      href: "/dashboard/organizer/analytics",
      icon: BarChart3,
    },
  ];

  const attendeeNavigation = [
    { name: "Dashboard", href: "/dashboard/attendee", icon: LayoutDashboard },
    {
      name: "Discover Events",
      href: "/dashboard/attendee/events",
      icon: Search,
    },
    {
      name: "My Attendance",
      href: "/dashboard/attendee/my-attendance",
      icon: CheckCircle2,
    },
  ];

  const navigation =
    role === "organizer" ? organizerNavigation : attendeeNavigation;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={
            role === "organizer"
              ? "/dashboard/organizer"
              : "/dashboard/attendee"
          }
          className="flex items-center gap-3"
        >
          <Image
            src={"/icon.png"}
            alt="proofpass logo icon"
            width={100}
            height={100}
            className="w-10 h-10 md:hidden"
          />
          <Image
            src={"/logo.png"}
            alt="proofpass logo"
            width={100}
            height={100}
            priority
            className="w-full hidden md:block"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <ConnectWalletButton />

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
