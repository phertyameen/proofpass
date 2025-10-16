import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Announcement Badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-primary/20 bg-primary/5"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              Built on Base • Powered by Blockchain
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Blockchain-Powered Event{" "}
            <span className="text-gradient-emerald-teal">Attendance</span>{" "}
            Verification
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Where <span className="text-primary font-semibold">Proof</span>{" "}
            Meets <span className="text-[#fbbf24] font-semibold">Profit</span>.
            Transform your events with verifiable attendance, seamless
            check-ins, and powerful analytics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="gradient-emerald-teal text-white hover:opacity-90 transition-opacity text-lg px-8 py-6"
            >
              Connect Wallet
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary/20 hover:bg-primary/5 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Immutable Records</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Instant Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Flexible Pricing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
