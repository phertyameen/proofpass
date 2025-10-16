export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description:
        "Sign in with your web3 wallet. No email, no password, just pure blockchain magic.",
      icon: "🔗",
    },
    {
      number: "02",
      title: "Create Your Event",
      description:
        "Set up your event details, pricing, and attendance rules in minutes. Choose your payment model.",
      icon: "🎪",
    },
    {
      number: "03",
      title: "Share QR Codes",
      description:
        "Generate unique QR codes for check-in. Attendees scan at the door for instant verification.",
      icon: "📱",
    },
    {
      number: "04",
      title: "Verify & Earn",
      description:
        "Attendance is recorded on-chain. Track analytics, process payments, and build your reputation.",
      icon: "✅",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            How <span className="text-gradient-emerald-teal">ProofPass</span>{" "}
            Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Four simple steps to transform your event management
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-secondary -translate-x-1/2" />
              )}

              <div className="relative space-y-4">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-emerald-teal text-white text-2xl font-bold">
                  {step.icon}
                </div>

                {/* Step Number */}
                <div className="text-sm font-mono text-muted-foreground">
                  STEP {step.number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold">{step.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
