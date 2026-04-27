import { Link } from "react-router-dom";
import { SecondaryNav } from "../components";
import { colors, spacing, fonts } from "../styles/theme";

const TEAM = [
  {
    emoji: "🤖",
    title: "AI-teknik",
    text: "Vi använder de senaste AI-modellerna från OpenAI och Stability AI för att skapa unika, professionellt skrivna berättelser och illustrationer.",
  },
  {
    emoji: "✍️",
    title: "Handgjord kärlek",
    text: "Vill du ha något extra personligt? Våra erfarna skribenter och illustratörer skapar boken helt för hand — precis som du föreställer dig den.",
  },
  {
    emoji: "🇸🇪",
    title: "Svenskt företag",
    text: "Minstory.se drivs av Bokarent Sverige AB, ett företag registrerat i Sverige. Vi värnar om din integritet och dina uppgifter hanteras säkert.",
  },
];

const VALUES = [
  { icon: "💛", title: "Personlighet", text: "Varje bok är unik — skapad specifikt för den person som ska få den." },
  { icon: "✨", title: "Kvalitet", text: "Vi kombinerar AI med mänsklig omsorg för ett resultat som verkligen berör." },
  { icon: "🔒", title: "Trygghet", text: "Säker betalning via Swish, inga onödiga konton, din data är din." },
  { icon: "💚", title: "Hållbarhet", text: "Digitala böcker är klimatsmarta, och vi arbetar aktivt för att minimera vår påverkan." },
];

function Section({ children, bg = "#fff", style = {} }) {
  return (
    <section style={{ background: bg, padding: `${spacing["5xl"]} ${spacing.lg}`, ...style }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}

function SectionHeading({ children, center = false }) {
  return (
    <h2 style={{
      fontSize: fonts.size["3xl"],
      fontWeight: fonts.weight.extrabold,
      color: colors.dark || "#1a202c",
      margin: `0 0 ${spacing.xl}`,
      fontFamily: "Georgia, serif",
      textAlign: center ? "center" : "left",
      lineHeight: 1.25,
    }}>
      {children}
    </h2>
  );
}

export function AboutPage() {
  return (
    <div>
      <SecondaryNav />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #FFF3D6 0%, #FFFBF2 60%, #FFF8E8 100%)",
        borderBottom: "2px solid #F3E2B8",
        padding: `${spacing["2xl"]} ${spacing.lg}`,
        textAlign: "center",
        color: "#1F2937",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 32, marginBottom: spacing.md }}>📚</div>
          <h1 style={{
            fontSize: fonts.size["3xl"],
            fontWeight: fonts.weight.extrabold,
            margin: `0 0 ${spacing.md}`,
            fontFamily: "Georgia, serif",
            lineHeight: 1.2,
            color: colors.dark || "#1a202c",
          }}>
            Om oss
          </h1>
          <p style={{
            fontSize: fonts.size.md,
            color: "#6B7280",
            lineHeight: 1.6,
            margin: 0,
          }}>
            Vi tror att varje person förtjänar sin egen berättelse — en bok som handlar om just dem,
            skapad med kärlek och omsorg.
          </p>
        </div>
      </section>

      {/* ── Vår historia ─────────────────────────────────────────── */}
      <Section bg="#fff">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing["4xl"], alignItems: "center" }}>
          <div>
            <SectionHeading>Vår historia</SectionHeading>
            <p style={{ fontSize: fonts.size.md, color: colors.textLight || "#555", lineHeight: 1.8, margin: `0 0 ${spacing.lg}` }}>
              Minstory.se grundades med en enkel idé: att göra det enkelt för vem som helst att skapa
              en personlig bok till någon de älskar. Oavsett om det är en barnbok om barnet i familjen,
              en minnebok till morfar eller en rolig berättelse till en vän — vi hjälper dig att förverkliga den.
            </p>
            <p style={{ fontSize: fonts.size.md, color: colors.textLight || "#555", lineHeight: 1.8, margin: 0 }}>
              Vi kombinerar modern AI-teknik med mänsklig kreativitet för att leverera böcker som
              verkligen känns personliga och genomtänkta. Resultatet är en bok du kan vara stolt över att ge bort.
            </p>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #FFFBF2, #FFF3DC)",
            borderRadius: 24,
            padding: spacing["4xl"],
            textAlign: "center",
            border: `2px solid ${colors.primaryLight || "#FCD34D"}`,
          }}>
            <div style={{ fontSize: 72, marginBottom: spacing.lg }}>✨</div>
            <p style={{
              fontSize: fonts.size.xl || "20px",
              fontWeight: fonts.weight.bold,
              color: colors.dark || "#1a202c",
              fontFamily: "Georgia, serif",
              lineHeight: 1.4,
              margin: 0,
            }}>
              "Varje person förtjänar sin egen berättelse"
            </p>
          </div>
        </div>
      </Section>

      {/* ── Vad vi erbjuder ──────────────────────────────────────── */}
      <Section bg={colors.light || "#FFFBF2"}>
        <SectionHeading center>Vad vi erbjuder</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: spacing.lg }}>
          {TEAM.map((item) => (
            <div key={item.title} style={{
              background: "#fff",
              borderRadius: 12,
              padding: `${spacing.xl} ${spacing.lg}`,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 30, marginBottom: spacing.md }}>{item.emoji}</div>
              <h3 style={{
                fontSize: fonts.size.md,
                fontWeight: fonts.weight.bold,
                color: colors.dark || "#1a202c",
                margin: `0 0 ${spacing.sm}`,
              }}>
                {item.title}
              </h3>
              <p style={{ fontSize: fonts.size.xs, color: colors.textLight || "#666", lineHeight: 1.6, margin: 0 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Våra värderingar ─────────────────────────────────────── */}
      <Section bg="#fff">
        <SectionHeading center>Våra värderingar</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: spacing.xl }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{
              padding: `${spacing["2xl"]} ${spacing.xl}`,
              borderRadius: 14,
              border: `1.5px solid ${colors.border || "#e2e8f0"}`,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: spacing.md }}>{v.icon}</div>
              <h4 style={{
                fontSize: fonts.size.md,
                fontWeight: fonts.weight.bold,
                color: colors.dark || "#1a202c",
                margin: `0 0 ${spacing.sm}`,
              }}>
                {v.title}
              </h4>
              <p style={{ fontSize: fonts.size.sm, color: colors.textLight || "#666", lineHeight: 1.6, margin: 0 }}>
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Om bolaget ───────────────────────────────────────────── */}
      <Section bg={colors.light || "#FFFBF2"}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <SectionHeading center>Företaget bakom</SectionHeading>
          <div style={{
            background: "#fff",
            borderRadius: 20,
            padding: `${spacing["3xl"]} ${spacing["4xl"]}`,
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          }}>
            <div style={{ fontSize: 48, marginBottom: spacing.lg }}>🏢</div>
            <h3 style={{
              fontSize: fonts.size["2xl"],
              fontWeight: fonts.weight.extrabold,
              color: colors.dark || "#1a202c",
              margin: `0 0 ${spacing.md}`,
              fontFamily: "Georgia, serif",
            }}>
              Bokarent Sverige AB
            </h3>
            <p style={{ fontSize: fonts.size.sm, color: colors.textLight || "#666", lineHeight: 1.8, margin: `0 0 ${spacing.lg}` }}>
              Minstory.se är en tjänst från Bokarent Sverige AB, ett företag registrerat i Sverige.
              Vi är passionerade om böcker, berättelser och teknologi — och vi tror att de tre
              tillsammans kan skapa något alldeles magiskt.
            </p>
            <div style={{
              display: "flex", justifyContent: "center", gap: spacing["2xl"],
              flexWrap: "wrap", marginTop: spacing.xl,
              paddingTop: spacing.xl,
              borderTop: `1px solid ${colors.border || "#e2e8f0"}`,
            }}>
              {[
                { label: "Registrerat i", value: "Sverige 🇸🇪" },
                { label: "Betalning via", value: "Swish 💳" },
                { label: "Böcker skapade", value: "AI + Handgjord ✍️" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: fonts.size.xs, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                  <div style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.bold, color: colors.dark || "#1a202c", marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Kontakt & CTA ────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: `${spacing["5xl"]} ${spacing.lg}`,
        textAlign: "center",
        color: "#fff",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: spacing.xl }}>💌</div>
          <h2 style={{
            fontSize: fonts.size["3xl"],
            fontWeight: fonts.weight.extrabold,
            margin: `0 0 ${spacing.lg}`,
            fontFamily: "Georgia, serif",
          }}>
            Har du frågor?
          </h2>
          <p style={{ fontSize: fonts.size.md, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: `0 0 ${spacing["3xl"]}` }}>
            Vi finns här för dig. Använd support-chatten på sidan, eller skapa din bok direkt — vi hjälper dig hela vägen.
          </p>
          <Link to="/skapa" style={{
            display: "inline-block",
            padding: `${spacing.lg} ${spacing["4xl"]}`,
            borderRadius: 14,
            border: "none",
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark || "#D97706"})`,
            color: "#fff",
            fontSize: fonts.size.lg || "18px",
            fontWeight: fonts.weight.extrabold,
            cursor: "pointer",
            textDecoration: "none",
            boxShadow: "0 4px 24px rgba(245,158,11,0.40)",
          }}>
            ✨ Skapa din bok nu
          </Link>
        </div>
      </section>

    </div>
  );
}
