import { Card } from "./UI";
import { colors, spacing, fonts } from "../styles/theme";

export function HowItWorks() {
  return (
    <section id="hur" style={{ padding: `${spacing["5xl"]} ${spacing.lg}`, background: colors.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: fonts.size["4xl"], margin: 0, color: colors.text, fontWeight: fonts.weight.extrabold }}>
          Hur det funkar
        </h2>
        <p style={{ opacity: 0.75, marginTop: spacing.md, fontSize: fonts.size.lg, color: colors.textLight }}>
          Tre enkla steg från idé till färdig berättelse.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: spacing.lg,
            marginTop: spacing["3xl"],
          }}
        >
          <Card title="1️ Välj tema">
            Börja med att välja vilken typ av berättelse du vill skapa – från barnsakor till kärlekshistorier till
            minnen.
          </Card>
          <Card title="2️ Fyll detaljerna">
            Berätta om personen: namn, ålder, intressen, relation till dig och vad berättelsen ska handla om.
          </Card>
          <Card title="3️ Få din bok">
            Vi skapar berättelsen på några minuter. Du får den digital direkt – tryck kan ordnas senare!
          </Card>
        </div>

        <div
          style={{
            marginTop: spacing["3xl"],
            background: colors.light,
            borderRadius: "16px",
            padding: spacing.xl,
            borderLeft: `4px solid ${colors.primary}`,
          }}
        >
          <p style={{ margin: 0, fontWeight: fonts.weight.bold, fontSize: fonts.size.lg, color: colors.text }}>
            💡 Pro-tips
          </p>
          <ul
            style={{
              margin: `${spacing.md} 0 0`,
              paddingLeft: spacing.lg,
              opacity: 0.8,
              fontSize: fonts.size.md,
              color: colors.textLight,
              lineHeight: 1.8,
            }}
          >
            <li>Ju mer du berättar om personen, desto bättre blir berättelsen</li>
            <li>Lägg till specifika intressen eller hemliga drömmar för personlig känsla</li>
            <li>Vi kan skapa flera versioner tills du är 100% nöjd</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
