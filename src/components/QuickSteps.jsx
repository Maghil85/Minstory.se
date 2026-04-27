import { colors, spacing, fonts, radius, shadows } from "../styles/theme";

export function QuickSteps() {
  const steps = [
    {
      id: 1,
      title: "Välj stil",
      description: "Barn, kärlek, familj eller äventyr.",
    },
    {
      id: 2,
      title: "Ladda upp bild",
      description: "Vi omvandlar bilden till en unik bokstil.",
    },
    {
      id: 3,
      title: "Få din bok",
      description: "Digitalt inom 24 timmar eller tryckt hem till dig.",
    },
  ];

  return (
    <section
      style={{
        background: "linear-gradient(180deg, rgba(245, 158, 11, 0.06) 0%, rgba(255, 255, 255, 1) 70%)",
        padding: `${spacing["2xl"]} ${spacing.lg}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            margin: 0,
            marginBottom: spacing.lg,
            fontSize: fonts.size.xl,
            fontWeight: fonts.weight.bold,
            color: "#F59E0B",
          }}
        >
          Så funkar det i 3 steg
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: spacing.md,
          }}
        >
          {steps.map((step) => (
            <div
              key={step.id}
              style={{
                border: "1px solid rgba(245, 158, 11, 0.2)",
                borderRadius: radius.lg,
                padding: spacing.lg,
                background: "linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, #FFFFFF 50%)",
                boxShadow: shadows.md,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#F59E0B",
                  color: colors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: fonts.size.sm,
                  fontWeight: fonts.weight.bold,
                  marginBottom: spacing.sm,
                  boxShadow: "0 3px 10px rgba(245, 158, 11, 0.35)",
                }}
              >
                {step.id}
              </div>
              <p
                style={{
                  margin: 0,
                  marginBottom: spacing.xs,
                  fontSize: fonts.size.md,
                  fontWeight: fonts.weight.semibold,
                  color: colors.text,
                }}
              >
                {step.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: fonts.size.sm,
                  color: colors.textLight,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
