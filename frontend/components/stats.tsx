export function Stats() {
  const stats = [
    {
      value: "10K+",
      label: "Events Created",
      company: "ETHGlobal",
    },
    {
      value: "99.9%",
      label: "Uptime",
      company: "DevCon",
    },
    {
      value: "500K+",
      label: "Verified Attendees",
      company: "NFT.NYC",
    },
    {
      value: "$2M+",
      label: "Revenue Processed",
      company: "Consensus",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-gradient-emerald-teal">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
