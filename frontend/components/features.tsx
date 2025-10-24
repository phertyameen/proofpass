import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      icon: "🎫",
      title: "QR Code Check-Ins",
      description:
        "Lightning-fast attendance verification with secure QR codes. No apps required, works on any device.",
      audience: "Organizers",
    },
    {
      icon: "⛓️",
      title: "Blockchain Verification",
      description:
        "Immutable proof of attendance stored on Base. Tamper-proof records that last forever.",
      audience: "Attendees",
    },
    {
      icon: "📊",
      title: "Real-Time Analytics",
      description:
        "Track attendance patterns, engagement metrics, and revenue in real-time dashboards.",
      audience: "Organizers",
    },
    {
      icon: "💰",
      title: "Flexible Payment Models",
      description:
        "Choose from organizer-paid, split payment, or attendee-paid models. Maximize your revenue.",
      audience: "Investors",
    },
    {
      icon: "🔐",
      title: "Wallet-Based Auth",
      description:
        "No passwords, no emails. Connect your wallet and you're in. True web3 authentication.",
      audience: "Attendees",
    },
    {
      icon: "📈",
      title: "Tiered Pricing Plans",
      description:
        "From free trials to enterprise solutions. Scale as you grow with transparent pricing.",
      audience: "Investors",
    },
  ];

  return (
    <section id="features" className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Everything You Need to{" "}
            <span className="text-gradient-emerald-teal">Succeed</span>
          </h2>
          <p className="text-l md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Built for event organizers, loved by attendees, trusted by
            investors.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{feature.icon}</div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {feature.audience}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
