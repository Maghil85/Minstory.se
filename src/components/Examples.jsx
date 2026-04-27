import { ExampleTile } from "./UI";
import { colors, spacing, fonts } from "../styles/theme";

export function Examples() {
  return (
    <section id="exempel" style={{ padding: `${spacing["5xl"]} ${spacing.lg}`, background: colors.light }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: fonts.size["4xl"], margin: 0, color: colors.text, fontWeight: fonts.weight.extrabold }}>
          Exempel på berättelser
        </h2>
        <p style={{ opacity: 0.75, marginTop: spacing.md, fontSize: fonts.size.lg, color: colors.textLight }}>
          Varje berättelse är unik och personlig. Här ser du några exempel på vad vi kan skapa.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: spacing.lg,
            marginTop: spacing["3xl"],
          }}
        >
          <ExampleTile
            title="✨ Isens Hjärta"
            subtitle="Fantasi • Äventyr • Mod"
            text="Emma hittar ett hemligt frostbibliotek under den glittrande isen och möter magiska väsen som behöver hennes hjälp att rädda vintern."
          />
          <ExampleTile
            title="🚀 Rymdäventyret"
            subtitle="Vetenskap • Utforskning • Vänskap"
            text="Alp och hans bästa vän åker till Mars för att hitta en förlorad rymdsond och découvrir en helt ny civilisation."
          />
          <ExampleTile
            title="🌲 Skogens Väktare"
            subtitle="Djur • Natur • Samarbete"
            text="Maja blir skogen väktare för en dag och måste samarbeta med olika djur för att skydda mychket hemma från en storm."
          />
          <ExampleTile
            title="💕 Vår kärlekshistoria"
            subtitle="Romantik • Minnen • Framtid"
            text="En berättelse om två som träffades, delade drömmar och planerar en framtid tillsammans – helt personligt för er relation."
          />
          <ExampleTile
            title="🎂 Min livs äventyrer"
            subtitle="Minne • Celebration • Värde"
            text="En sammanfattning av 80 år av liv: från barn på landet till äventyrare runt världen till pensionär med många älskade omkring sig."
          />
          <ExampleTile
            title="😄 Vännernas roliga historia"
            subtitle="Humor • Gemenskap • Insidar-jokes"
            text="En helt galen berättelse fylld med insidar-jokes och roliga minnen som bara era vänner skulle förstå och skratta åt."
          />
        </div>
      </div>
    </section>
  );
}
