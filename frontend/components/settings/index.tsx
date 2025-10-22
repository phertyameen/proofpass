"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard-header";
import { Bell, Shield, Wallet, Globe } from "lucide-react";
import { useState } from "react";

export default function SettingsView() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role="organizer" />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gradient-emerald-teal">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your ProofPass account preferences
            </p>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Information
              </CardTitle>
              <CardDescription>Your connected wallet details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Network</Label>
                <Input value="Ethereum Mainnet" readOnly />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive event updates via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get real-time check-in alerts
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>Protect your ProofPass account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex gap-2">
                  <Input type="email" placeholder="your@email.com" />
                  <Button variant="outline">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your ProofPass experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark theme
                  </p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Language</Label>
                <Input value="English (US)" readOnly />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input value="UTC +1 (Lagos)" readOnly />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your ProofPass account
                  </p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
