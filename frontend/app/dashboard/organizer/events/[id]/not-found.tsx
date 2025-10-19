import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <CardTitle>Event Not Found</CardTitle>
          </div>
          <CardDescription>
            The event you&apos;re looking for doesn&apos;t exist or has been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/organizer/events">
            <Button className="w-full gradient-emerald-teal text-white hover:opacity-90">
              Back to Events
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
