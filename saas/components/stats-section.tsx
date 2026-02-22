export function StatsSection() {
  const stats = [
    {
      value: "2.4M",
      label: "images generated",
      detail: "this month",
    },
    {
      value: "98%",
      label: "satisfaction rate",
      detail: "from active users",
    },
    {
      value: "<3s",
      label: "average time",
      detail: "per image",
    },
    {
      value: "+47%",
      label: "more conversions",
      detail: "on average",
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center lg:text-left ${
                index < stats.length - 1
                  ? "lg:border-r lg:border-border lg:pr-8"
                  : ""
              }`}
            >
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-1 tracking-tight font-display">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

