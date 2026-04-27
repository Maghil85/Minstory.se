import { colors, spacing, fonts } from "../styles/theme";

const sections = [
  {
    title: "1. Om tjänsten",
    text: "minstory.se drivs av Bokarent Sverige AB. Tjänsten låter dig skapa personliga, AI-genererade böcker. Genom att använda tjänsten godkänner du dessa villkor.",
  },
  {
    title: "2. Användarkonto",
    text: "Du kan skapa böcker utan konto. Om du skapar ett konto ansvarar du för att hålla dina inloggningsuppgifter säkra. Du är ansvarig för all aktivitet som sker via ditt konto.",
  },
  {
    title: "3. Innehåll och upphovsrätt",
    text: "Böcker som skapas via tjänsten genereras med hjälp av AI (OpenAI och Stability AI) baserat på din input. Du äger rätten att använda din genererade bok för personligt bruk. Vi förbehåller oss rätten att använda anonymiserade och aggregerade data för att förbättra tjänsten.",
  },
  {
    title: "4. Förbjudet innehåll",
    text: "Det är förbjudet att använda tjänsten för att skapa innehåll som är kränkande, diskriminerande, sexuellt explicit, våldsamt eller på annat sätt olagligt. Vi förbehåller oss rätten att neka eller ta bort sådant innehåll.",
  },
  {
    title: "5. Betalning och återbetalning",
    text: "Priser anges i svenska kronor inklusive moms. Betalning sker via Swish. Digitala böcker återbetalas inte efter att de har genererats, eftersom tjänsten förbrukas direkt. Tryckta böcker kan inte returneras eftersom de är personliga och produceras på beställning.",
  },
  {
    title: "6. Leverans av tryckt bok",
    text: "Leveranstid för tryckta böcker är 3–7 arbetsdagar inom Sverige. Vi ansvarar inte för förseningar orsakade av fraktbolag. Kontakta oss på hello@minstory.se om din bok inte anlänt inom 14 dagar.",
  },
  {
    title: "7. Ansvarsbegränsning",
    text: "Tjänsten tillhandahålls i befintligt skick. Vi garanterar inte att AI-genererat innehåll är felfritt eller uppfyller specifika förväntningar. Vårt ansvar är begränsat till det belopp du betalat för din beställning.",
  },
  {
    title: "8. Ändringar av villkoren",
    text: "Vi kan uppdatera dessa villkor. Vid väsentliga ändringar informerar vi via e-post (om du har ett konto) eller via ett meddelande på webbplatsen. Fortsatt användning av tjänsten innebär att du accepterar de nya villkoren.",
  },
  {
    title: "9. Tillämplig lag",
    text: "Dessa villkor regleras av svensk lag. Tvister avgörs i svensk domstol med Stockholms tingsrätt som första instans.",
  },
  {
    title: "10. Kontakt",
    text: "Frågor om villkoren? Kontakta oss på hello@minstory.se.",
  },
];

export function AnvandarvillkorPage() {
  return (
    <div style={{ minHeight: "100vh", background: colors.white }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #FFF3D6 0%, #FFFBF2 60%, #FFF8E8 100%)",
        padding: `${spacing["4xl"]} ${spacing.lg} ${spacing["3xl"]}`,
        textAlign: "center",
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{ fontSize: "36px", marginBottom: spacing.md }}>📋</div>
        <h1 style={{
          fontSize: fonts.size["3xl"],
          fontWeight: fonts.weight.extrabold,
          color: colors.dark,
          margin: `0 0 ${spacing.md}`,
          fontFamily: "Georgia, serif",
        }}>
          Användarvillkor
        </h1>
        <p style={{ color: colors.text, fontSize: fonts.size.md, margin: 0, opacity: 0.7 }}>
          Senast uppdaterad: april 2026
        </p>
      </div>

      {/* Innehåll */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: `${spacing["4xl"]} ${spacing.lg}` }}>
        <p style={{
          fontSize: fonts.size.md,
          color: colors.text,
          lineHeight: 1.8,
          marginBottom: spacing["3xl"],
          background: "#FFF8E8",
          border: `1px solid #FFE4A0`,
          borderRadius: "12px",
          padding: `${spacing.xl} ${spacing["2xl"]}`,
        }}>
          Dessa användarvillkor gäller för dig som använder minstory.se. Läs dem noggrant innan du beställer.
        </p>

        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: spacing["2xl"] }}>
            <h2 style={{
              fontSize: fonts.size.lg,
              fontWeight: fonts.weight.bold,
              color: colors.dark,
              margin: `0 0 ${spacing.sm}`,
            }}>
              {s.title}
            </h2>
            <p style={{
              fontSize: fonts.size.md,
              color: colors.text,
              lineHeight: 1.8,
              margin: 0,
            }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
