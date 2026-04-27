import { useState } from "react";
import { StoryTypeCard } from "./UI";
import { colors, spacing, fonts, storyTypes } from "../styles/theme";

export function StoryTypesSection() {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <section id="berattelser" style={{ padding: `${spacing["5xl"]} ${spacing.lg}`, background: colors.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: spacing["3xl"] }}>
          <p
            style={{
              display: "inline-block",
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: "999px",
              background: colors.pastelLila,
              border: `1px solid ${colors.primary}`,
              margin: 0,
              fontWeight: fonts.weight.bold,
              fontSize: fonts.size.sm,
              color: colors.primary,
            }}
          >
            Välj din berättelsetyp
          </p>

          <h2 style={{ fontSize: fonts.size["4xl"], margin: `${spacing.lg} 0 ${spacing.md}`, color: colors.text }}>
            Vilken slags berättelse vill du skapa?
          </h2>

          <p
            style={{
              opacity: 0.8,
              marginTop: spacing.md,
              maxWidth: 600,
              margin: "0 auto",
              fontSize: fonts.size.lg,
              color: colors.textLight,
            }}
          >
            Minstory är inte bara för barn. Skapa sagor för barn, kärlekshistorier för partners, äventyr för vänner,
            eller minnen för familjen.
          </p>
        </div>

        {/* Story type grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: spacing.lg,
            marginBottom: spacing["3xl"],
          }}
        >
          {storyTypes.map((story) => (
            <StoryTypeCard
              key={story.id}
              story={story}
              isSelected={selectedType === story.id}
              onClick={() => setSelectedType(story.id)}
            />
          ))}
        </div>

        {selectedType && (
          <div
            style={{
              background: colors.light,
              border: `1px solid ${colors.border}`,
              borderRadius: "16px",
              padding: spacing.xl,
              textAlign: "center",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <p style={{ margin: 0, fontSize: fonts.size.lg, color: colors.text }}>
              ✨ Du har valt: <strong>{storyTypes.find((s) => s.id === selectedType)?.name}</strong>
            </p>
            <p
              style={{
                margin: `${spacing.md} 0 0`,
                opacity: 0.7,
                fontSize: fonts.size.md,
                color: colors.textLight,
              }}
            >
              Du kommer att kunna fylla i detaljer om personen och berättelsen i nästa steg.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
