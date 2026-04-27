import { useState } from "react";
import { Link } from "react-router-dom";
import { SecondaryNav } from "../components";
import { colors, spacing, fonts } from "../styles/theme";

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: fonts.size["2xl"],
      fontWeight: fonts.weight.extrabold,
      color: colors.dark || "#1a202c",
      margin: 0,
      fontFamily: "Georgia, serif",
    }}>
      {children}
    </h2>
  );
}

function Check({ children }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: fonts.size.sm, color: "#555", lineHeight: 1.6 }}>
      <span style={{ color: "#38a169", fontWeight: 700, marginTop: 2 }}>✔</span>
      <span>{children}</span>
    </li>
  );
}

// ── Priskort ─────────────────────────────────────────────────────────────────
function PriceTier({ dot, label, pages, price, features = [], popular }) {
  const dotColor = { "🟢": "#38a169", "🔵": "#3182ce", "🟣": "#6B46C1" }[dot] || "#888";
  return (
    <div style={{
      background: popular ? "linear-gradient(135deg, #6B46C1, #553c9a)" : "#fff",
      color: popular ? "#fff" : "inherit",
      borderRadius: 12,
      padding: `${spacing.lg} ${spacing.lg}`,
      border: popular ? "none" : `1.5px solid ${colors.border || "#e2e8f0"}`,
      position: "relative",
      boxShadow: popular ? "0 6px 20px rgba(107,70,193,0.25)" : "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {popular && (
        <div style={{
          position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
          background: colors.primary || "#F59E0B", color: "#fff",
          fontSize: 10, fontWeight: 800, padding: "2px 10px",
          borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.04em",
        }}>
          ⭐ MEST POPULÄR
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: spacing.sm }}>
        <span style={{ fontSize: 16 }}>{dot}</span>
        <span style={{ fontWeight: 700, fontSize: fonts.size.sm, color: popular ? "#fff" : dotColor }}>{label}</span>
      </div>
      <div style={{ fontSize: fonts.size["2xl"], fontWeight: fonts.weight.extrabold, margin: `0 0 2px`, color: popular ? "#fff" : (colors.dark || "#1a202c") }}>
        {price}
      </div>
      <div style={{ fontSize: fonts.size.xs, opacity: 0.7, marginBottom: spacing.md }}>{pages} sidor</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
        {features.map((f) => (
          <li key={f} style={{ display: "flex", gap: 6, fontSize: fonts.size.xs, alignItems: "flex-start", color: popular ? "#e9d5ff" : "#555" }}>
            <span style={{ color: popular ? "#c4b5fd" : "#38a169", fontWeight: 700, marginTop: 1 }}>✔</span> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── FAQ-rad ───────────────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 12, border: `1.5px solid ${colors.border || "#e2e8f0"}`, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", textAlign: "left", padding: `${spacing.lg} ${spacing.xl}`,
          background: open ? (colors.light || "#FFFBF2") : "#fff",
          border: "none", cursor: "pointer", fontFamily: "inherit",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: fonts.size.md, fontWeight: fonts.weight.semibold, color: colors.dark || "#1a202c",
        }}
      >
        {q}
        <span style={{ fontSize: 18, color: "#aaa", transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none", marginLeft: spacing.xl }}>+</span>
      </button>
      {open && (
        <div style={{ padding: `0 ${spacing.xl} ${spacing.lg}`, fontSize: fonts.size.sm, color: "#555", lineHeight: 1.7, background: colors.light || "#FFFBF2" }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ── Sectionhuvud ─────────────────────────────────────────────────────────────
function SecHead({ icon, title, sub }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: spacing.lg,
      marginBottom: spacing["2xl"], paddingBottom: spacing.lg,
      borderBottom: `2px solid ${colors.border || "#e2e8f0"}`,
    }}>
      <span style={{ fontSize: 40 }}>{icon}</span>
      <div>
        <SectionTitle>{title}</SectionTitle>
        {sub && <p style={{ margin: `${spacing.xs} 0 0`, fontSize: fonts.size.sm, color: "#777" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Sida ──────────────────────────────────────────────────────────────────────
export function PricingPage() {
  return (
    <main style={{ background: colors.white }}>
      <SecondaryNav />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #FFF3D6 0%, #FFFBF2 60%, #FFF8E8 100%)",
        padding: `${spacing["2xl"]} ${spacing.lg}`,
        textAlign: "center", color: "#1F2937",
        borderBottom: "2px solid #F3E2B8",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 30, marginBottom: spacing.md }}>💰</div>
          <h1 style={{ fontSize: fonts.size["3xl"], fontWeight: fonts.weight.extrabold, margin: `0 0 ${spacing.md}`, fontFamily: "Georgia, serif", lineHeight: 1.2 }}>
            Enkla och tydliga priser
          </h1>
          <p style={{ fontSize: fonts.size.md, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
            Välj hur din bok ska skapas — snabbt med AI eller mer exklusivt illustrerad.<br />
            <strong style={{ color: colors.primaryDark }}>Inga dolda kostnader.</strong>
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: `${spacing["5xl"]} ${spacing.lg}` }}>

        {/* 1. AI-skapad */}
        <section style={{ marginBottom: spacing["5xl"] }}>
          <SecHead icon="⚡" title="1. AI-skapad bok" sub="Skapas direkt och är redo att läsa på några minuter" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: spacing.xl }}>
            <PriceTier dot="🟢" label="Standard" pages={15} price="69 kr"
              features={["Personlig berättelse", "AI-genererade illustrationer", "Leverans direkt", "Digital bok (PDF)"]} />
            <PriceTier dot="🔵" label="Populär" pages={20} price="109 kr" popular
              features={["Längre story", "Fler bilder", "Bättre upplevelse", "Digital bok (PDF)"]} />
            <PriceTier dot="🟣" label="Premium" pages={24} price="149 kr"
              features={["Full bok", "Rik berättelse", "Högre detaljnivå", "Digital bok (PDF)"]} />
          </div>
        </section>

        {/* 2. Handgjord */}
        <section style={{ marginBottom: spacing["5xl"] }}>
          <SecHead icon="🎨" title="2. Personligt illustrerad bok" sub="Skapas med extra omsorg och manuella justeringar för ett unikt resultat" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: spacing.xl, marginBottom: spacing.xl }}>
            <PriceTier dot="🟢" label="Standard" pages={15} price="349 kr"
              features={["Personlig berättelse", "Handritade illustrationer", "Korrekturläsning ingår", "Digital bok (PDF)"]} />
            <PriceTier dot="🔵" label="Populär" pages={20} price="499 kr" popular
              features={["Längre story", "Fler illustrationer", "Prioriterad hantering", "Digital bok (PDF)"]} />
            <PriceTier dot="🟣" label="Premium" pages={24} price="599 kr"
              features={["Full bok", "Detaljrika illustrationer", "Fria justeringar", "Digital bok (PDF)"]} />
          </div>
          <div style={{
            background: colors.light || "#FFFBF2", borderRadius: 12,
            padding: `${spacing.lg} ${spacing["2xl"]}`,
            display: "flex", gap: spacing["3xl"], flexWrap: "wrap",
          }}>
            <div style={{ fontSize: fonts.size.sm, color: "#555" }}><strong>👉 Leverans:</strong> 1–3 dagar</div>
            <div style={{ fontSize: fonts.size.sm, color: "#555" }}><strong>👉 Justeringar:</strong> ingår utan extra kostnad</div>
          </div>
        </section>

        {/* 3. Tryckt tillägg */}
        <section style={{ marginBottom: spacing["5xl"] }}>
          <SecHead icon="📖" title="3. Tryckt bok (tillägg)" sub="Vill du få din bok hem? Lägg till tryck vid beställning" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing.xl }}>
            {[
              { icon: "📗", type: "Soft cover", price: "+199 kr", desc: "Flexibelt omslag, lätt att bära med sig" },
              { icon: "📘", type: "Hard cover", price: "+299 kr", desc: "Stabilt omslag, perfekt att spara i hyllan" },
            ].map((c) => (
              <div key={c.type} style={{
                background: "#fff", borderRadius: 14,
                padding: `${spacing["2xl"]} ${spacing.xl}`,
                border: `1.5px solid ${colors.border || "#e2e8f0"}`,
                display: "flex", alignItems: "flex-start", gap: spacing.lg,
              }}>
                <span style={{ fontSize: 36 }}>{c.icon}</span>
                <div>
                  <div style={{ fontWeight: fonts.weight.bold, fontSize: fonts.size.md, color: colors.dark || "#1a202c" }}>{c.type}</div>
                  <div style={{ fontSize: fonts.size["2xl"], fontWeight: fonts.weight.extrabold, color: colors.primary || "#F59E0B", margin: `${spacing.xs} 0` }}>{c.price}</div>
                  <div style={{ fontSize: fonts.size.sm, color: "#777" }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: spacing.lg, fontSize: fonts.size.sm, color: "#777" }}>
            👉 Leveranstid: 3–7 arbetsdagar efter godkännande
          </div>
        </section>

        {/* 4. Vad ingår */}
        <section style={{ marginBottom: spacing["5xl"] }}>
          <SecHead icon="💡" title="4. Vad ingår alltid?" />
          <div style={{ background: colors.light || "#FFFBF2", borderRadius: 16, padding: `${spacing["2xl"]} ${spacing["3xl"]}` }}>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing.lg }}>
              <Check>Personlig bok baserad på dina val</Check>
              <Check>Unik varje gång — aldrig en kopia</Check>
              <Check>Digital leverans direkt (AI-bok)</Check>
              <Check>Möjlighet att beställa tryckt version</Check>
              <Check>Kundtjänst &amp; support ingår</Check>
              <Check>100% nöjdhetsgaranti</Check>
            </ul>
          </div>
        </section>

        {/* 6. FAQ */}
        <section style={{ marginBottom: spacing["5xl"] }}>
          <SecHead icon="❓" title="5. Vanliga frågor" />
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
            <FaqItem q="Kan jag ändra min bok?" a="Ja! Du kan skapa en ny version när som helst eller kontakta oss för justeringar. Handgjorda böcker inkluderar fria ändringar." />
            <FaqItem q="Hur snabbt får jag min bok?" a="AI-bok: klar på några minuter direkt i webbläsaren. Handgjord illustrerad bok: 1–3 arbetsdagar. Tryckt bok: 3–7 arbetsdagar efter godkännande." />
            <FaqItem q="Är varje bok unik?" a="Ja — varje bok skapas individuellt baserat på dina val. Ingen annan får exakt samma bok." />
            <FaqItem q="Hur betalar jag?" a="Vi tar betalt via Swish. Säker, enkel och utan krångel. Inget konto behövs för att köpa." />
            <FaqItem q="Vad händer om jag inte är nöjd?" a="Vi erbjuder 100% nöjdhetsgaranti. Kontakta vår support så löser vi det — antingen med en ny version eller full återbetalning." />
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: "linear-gradient(135deg, #FFF3D6 0%, #FFFBF2 60%, #FFF8E8 100%)",
          border: "2px solid #F3E2B8",
          borderRadius: 24, padding: `${spacing["5xl"]} ${spacing.lg}`,
          textAlign: "center", color: "#1F2937",
        }}>
          <div style={{ fontSize: 48, marginBottom: spacing.xl }}>🚀</div>
          <h2 style={{ fontSize: fonts.size["3xl"], fontWeight: fonts.weight.extrabold, margin: `0 0 ${spacing.lg}`, fontFamily: "Georgia, serif", color: colors.dark || "#1a202c" }}>
            Redo att skapa en minnesvärdig bok?
          </h2>
          <p style={{ fontSize: fonts.size.md, color: "#6B7280", margin: `0 0 ${spacing["3xl"]}`, lineHeight: 1.7 }}>
            Det tar bara några minuter. Välj innehåll, betala via Swish — och din bok är klar.
          </p>
          <Link
            to="/skapa"
            style={{
              display: "inline-block",
              padding: `${spacing.lg} ${spacing["4xl"]}`,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`,
              color: "#fff",
              fontSize: fonts.size.lg,
              fontWeight: fonts.weight.extrabold,
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(245,158,11,0.35)",
            }}
          >
            ✨ Skapa din bok nu
          </Link>
        </section>

      </div>
    </main>
  );
}
