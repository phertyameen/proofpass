import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for testing the platform",
      features: [
        "1 event",
        "Max 50 attendees",
        "Basic analytics",
        "QR code check-in",
        "Community support",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "For growing event organizers",
      features: [
        "10 events/month",
        "Unlimited attendees",
        "Advanced analytics",
        "Custom branding",
        "Email support",
        "Export data",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Pro",
      price: "$99",
      period: "per month",
      description: "For professional event companies",
      features: [
        "Unlimited events",
        "Unlimited attendees",
        "Real-time analytics",
        "White-label solution",
        "Priority support",
        "API access",
        "Custom integrations",
      ],
      cta: "Go Pro",
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large institutions",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom contract terms",
        "SLA guarantees",
        "On-premise deployment",
        "Advanced security",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Simple,{" "}
            <span className="text-gradient-emerald-teal">Transparent</span>{" "}
            Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Choose the plan that fits your needs. Scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10 scale-105"
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-emerald-teal text-white border-0 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="space-y-4 pb-8">
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "gradient-emerald-teal text-white hover:opacity-90"
                      : "border-primary/20 hover:bg-primary/5"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Fees */}
        <Card className="bg-muted/30 border-border/50">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-4">Additional Fees</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-medium mb-2">Per-Event Fee</div>
                <div className="text-muted-foreground">
                  $5-15 base fee per event created
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Per-Attendee Fee</div>
                <div className="text-muted-foreground">
                  $0.10-0.50 per check-in/registration
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Payment Options</div>
                <div className="text-muted-foreground">
                  Organizer pays all, split model, or attendee-paid
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
