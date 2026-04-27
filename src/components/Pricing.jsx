import { Link } from "react-router-dom";
import { PriceCard } from "./UI";
import { colors, spacing, fonts } from "../styles/theme";

export function Pricing() {
  return (
    <section id="pris" style={{ padding: `${spacing["5xl"]} ${spacing.lg}`, background: colors.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: fonts.size["4xl"], margin: 0, color: colors.text, fontWeight: fonts.weight.extrabold }}>
          Pris
        </h2>
        <p style={{ opacity: 0.75, marginTop: spacing.md, fontSize: fonts.size.lg, color: colors.textLight }}>
          Enkelt och transparent. Du kan uppgradera senare.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: spacing.lg,
            marginTop: spacing["3xl"],
          }}
        >
          <PriceCard
            title="📱 Digital bok"
            price="199 kr"
            points={[
              "PDF att ladda ner",
              "Personlig text & historia",
              "Illustration (AI eller klassisk stil)",
              "Leverans samma dag",
              "Obegränsade versioner",
            ]}
            primary
            onClick={() => {}}
            buttonText="Skapa digital bok"
            isLink={true}
            linkTo="/skapa"
          />
          <PriceCard
            title="📖 Tryckt bok"
            price="349–499 kr"
            points={[
              "Professionell pappersbok",
              "Hård eller soft cover",
              "Högre upplösning & kvalitet",
              "Hemlevering 3–7 dagar",
              "Revideras tills du är nöjd",
            ]}
            onClick={() => {}}
            buttonText="Intresseanmäl tryck"
            linkTo="/skapa"
            isLink={true}
          />
          <PriceCard
            title="🎁 Paket (flera böcker)"
            price="Från 899 kr"
            points={[
              "2–5 personliga böcker",
              "Samma tema eller olika",
              "Rabatt på volym",
              "Digital + tryck möjligt",
              "Perfekt som familjegåva",
            ]}
            onClick={() => {}}
            buttonText="Kontakta oss för paket"
            linkTo="/skapa"
            isLink={true}
          />
        </div>

        {/* FAQ */}
        <div
          style={{
            marginTop: spacing["3xl"],
            background: colors.light,
            borderRadius: "16px",
            padding: spacing.xl,
          }}
        >
          <h3 style={{ margin: 0, marginBottom: spacing.lg, fontSize: fonts.size.xl, fontWeight: fonts.weight.bold }}>
            ❓ Vanliga frågor
          </h3>

          <div style={{ display: "grid", gap: spacing.lg }}>
            <div>
              <p style={{ margin: 0, fontWeight: fonts.weight.bold, color: colors.text }}>
                Kan jag få versioner tillbaka för att redigera?
              </p>
              <p style={{ margin: `${spacing.xs} 0 0`, opacity: 0.8 }}>
                Ja! Du kan alltid be om ändringar. Första versionen är inkluderad. Fler versioner kostar 99 kr extra.
              </p>
            </div>

            <div>
              <p style={{ margin: 0, fontWeight: fonts.weight.bold, color: colors.text }}>
                Hur länge tar det?
              </p>
              <p style={{ margin: `${spacing.xs} 0 0`, opacity: 0.8 }}>
                Digital bok levereras samma dag eller dagen efter. Tryckt bok tar 3–7 dagar från godkännande.
              </p>
            </div>

            <div>
              <p style={{ margin: 0, fontWeight: fonts.weight.bold, color: colors.text }}>
                Vad om jag inte gillar förslaget?
              </p>
              <p style={{ margin: `${spacing.xs} 0 0`, opacity: 0.8 }}>
                Du kan skapa helt nya versioner för att hitta rätt känsla. Vi arbetar tills du är 100% nöjd.
              </p>
            </div>

            <div>
              <p style={{ margin: 0, fontWeight: fonts.weight.bold, color: colors.text }}>
                Kan jag skapa flera böcker?
              </p>
              <p style={{ margin: `${spacing.xs} 0 0`, opacity: 0.8 }}>
                Ja! Varje projekt kostar separat, men vi ger rabatt från tredje boken och framåt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
