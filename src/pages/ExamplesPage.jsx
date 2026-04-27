import { SecondaryNav } from "../components";
import { BookExamplesShowcase } from "../components/BookExamplesShowcase";
import { colors, spacing, fonts } from "../styles/theme";

export function ExamplesPage() {
  return (
    <main style={{ background: colors.white }}>
      <SecondaryNav />
      {/* Header section */}
      <section
        style={{
          background: "linear-gradient(135deg, #FFF3D6 0%, #FFFBF2 60%, #FFF8E8 100%)",
          borderBottom: "2px solid #F3E2B8",
          padding: `${spacing["2xl"]} ${spacing.lg}`,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 30, marginBottom: spacing.md }}>📖</div>
          <h1 style={{
            fontSize: fonts.size["3xl"],
            fontWeight: fonts.weight.extrabold,
            margin: `0 0 ${spacing.md}`,
            fontFamily: "Georgia, serif",
            lineHeight: 1.2,
            color: colors.dark || "#1a202c",
          }}>
            Våra böcker
          </h1>
          <p style={{
            fontSize: fonts.size.md,
            color: "#6B7280",
            lineHeight: 1.6,
            margin: 0,
          }}>
            Se exempel på riktiga böcker vi har skapat. Varje bok är helt unik och personlig.
          </p>
        </div>
      </section>

      {/* Book Examples Showcase - Created Books */}
      <BookExamplesShowcase />
    </main>
  );
}
