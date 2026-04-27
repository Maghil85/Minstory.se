import { colors, spacing, fonts } from "../styles/theme";

const sections = [
  {
    title: "1. Vilka uppgifter vi samlar in",
    text: "Vi samlar in uppgifter som du lämnar när du skapar en bok: namn, e-postadress, beskrivningar av personerna i boken samt bilder du väljer att ladda upp. Vi samlar även in teknisk information om din enhet och ditt besök (t.ex. IP-adress och webbläsartyp) via vår webbserver.",
  },
  {
    title: "2. Varför vi behandlar dina uppgifter",
    text: "Dina uppgifter används för att: (a) generera och leverera din personliga bok, (b) hantera din beställning och betalning, (c) kontakta dig angående din order, (d) förbättra vår tjänst. Rättslig grund är fullgörande av avtal (art. 6.1 b GDPR) och berättigat intresse (art. 6.1 f GDPR).",
  },
  {
    title: "3. Hur länge vi sparar uppgifterna",
    text: "Orderuppgifter sparas i 7 år enligt bokföringslagen. Bokinnehåll (text och bilder) raderas på din begäran eller automatiskt 12 månader efter skapandet om inget konto är kopplat.",
  },
  {
    title: "4. Delning med tredje part",
    text: "Vi delar uppgifter med: OpenAI (för textgenerering), Stability AI (för bildgenerering) och Firebase/Google (för lagring). Alla leverantörer är bundna av databehandlingsavtal och hanterar data inom EU eller med lämpliga skyddsåtgärder.",
  },
  {
    title: "5. Dina rättigheter",
    text: "Du har rätt att begära tillgång till, rättelse av eller radering av dina personuppgifter. Du kan också invända mot behandling eller begära begränsning. Kontakta oss på hello@minstory.se. Du har rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).",
  },
  {
    title: "6. Cookies",
    text: "Vi använder nödvändiga cookies för att webbplatsen ska fungera. Vi använder inga spårnings- eller reklamcookies.",
  },
  {
    title: "7. Kontakt",
    text: "Frågor om vår integritetspolicy? Kontakta oss på hello@minstory.se.",
  },
];

export function IntegritetspolicyPage() {
  return (
    <div style={{ minHeight: "100vh", background: colors.white }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #FFF3D6 0%, #FFFBF2 60%, #FFF8E8 100%)",
        padding: `${spacing["4xl"]} ${spacing.lg} ${spacing["3xl"]}`,
        textAlign: "center",
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{ fontSize: "36px", marginBottom: spacing.md }}>🔒</div>
        <h1 style={{
          fontSize: fonts.size["3xl"],
          fontWeight: fonts.weight.extrabold,
          color: colors.dark,
          margin: `0 0 ${spacing.md}`,
          fontFamily: "Georgia, serif",
        }}>
          Integritetspolicy
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
          Vi på minstory.se värnar om din integritet. Den här policyn förklarar vilka uppgifter vi samlar in, varför och hur vi skyddar dem.
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
