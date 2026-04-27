import { colors, spacing, fonts } from "../styles/theme";

export function FeatureBar() {
  const features = [
    {
      icon: "📚",
      title: "Hundratals mallar",
      description: "för varje tillfälle",
    },
    {
      icon: "⚡",
      title: "Unikt skapad för dig",
      description: "helt personlig",
    },
    {
      icon: "🚚",
      title: "Gratis frakt",
      description: "vid beställning",
    },
    {
      icon: "🛡️",
      title: "100% säkert",
      description: "och privat",
    },
    {
      icon: "💾",
      title: "Digital kopia",
      description: "direkt tillgänglig",
    },
  ];

  return (
    <section
      style={{
        background: colors.white,
        padding: `${spacing.lg} ${spacing.lg}`,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "rgba(245, 158, 11, 0.08)",
          borderRadius: "12px",
          padding: spacing.md,
          border: "1px solid rgba(245, 158, 11, 0.15)",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: spacing.xs,
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              textAlign: "center",
              padding: spacing.xs,
              borderRadius: "8px",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.light;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                fontSize: "18px",
                marginBottom: "4px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {feature.icon}
            </div>
            <h3
              style={{
                margin: 0,
                marginBottom: "2px",
                fontSize: "11px",
                fontWeight: fonts.weight.semibold,
                color: colors.text,
                letterSpacing: "0.2px",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "10px",
                color: colors.textLight,
                fontWeight: fonts.weight.normal,
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
