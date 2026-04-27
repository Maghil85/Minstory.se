import { SecondaryNav } from "../components";
import { HowItWorks } from "../components/HowItWorks";
import { colors, spacing, fonts } from "../styles/theme";

export function HowItWorksPage() {
  return (
    <main style={{ background: colors.white }}>
      <SecondaryNav />
      {/* Header section */}
      <section
        style={{
          background: `linear-gradient(135deg, ${colors.pastelBlue} 0%, ${colors.pastelGreen} 100%)`,
          padding: `${spacing["3xl"]} ${spacing.lg}`,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: fonts.size["4xl"],
              marginBottom: spacing.lg,
              color: colors.text,
              fontWeight: fonts.weight.extrabold,
            }}
          >
            En enkel process
          </h1>
          <p
            style={{
              fontSize: fonts.size.lg,
              color: colors.textLight,
              lineHeight: 1.6,
            }}
          >
            Från idé till färdig bok på bara tre steg. Det är mer enkelt än du tror!
          </p>
        </div>
      </section>

      {/* Process */}
      <HowItWorks />
    </main>
  );
}
