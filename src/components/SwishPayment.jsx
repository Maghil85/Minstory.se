import { colors, spacing, fonts } from "../styles/theme";

const SWISH_NUMBER = import.meta.env.VITE_SWISH_NUMBER || "123 094 78 87";
const SWISH_NAME   = import.meta.env.VITE_SWISH_NAME   || "Bokarent Sverige AB";

export function SwishPayment({ price, pageCount, personName, onPaid, onBack }) {
  const amountNum   = price ? price.replace(/[^0-9]/g, "") : "";
  const swishMsg    = `Minstory ${pageCount} sidor`;
  const deepLink    = `swish://payment?data={"version":1,"payee":{"value":"${SWISH_NUMBER.replace(/\s/g, "")}","editable":false},"amount":{"value":${amountNum},"editable":false},"message":{"value":"${swishMsg}","editable":false}}`;

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: `${spacing["5xl"]} ${spacing.lg}`,
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: spacing["3xl"] }}>
          <div style={{ fontSize: "64px", marginBottom: spacing.lg }}>💸</div>
          <h2 style={{ fontSize: fonts.size["2xl"], fontWeight: fonts.weight.extrabold, color: "#fff", margin: `0 0 ${spacing.sm}` }}>
            Betala med Swish
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: fonts.size.sm, margin: 0 }}>
            Slutför betalningen — sedan skapar vi din bok direkt.
          </p>
        </div>

        {/* Betalkortet */}
        <div style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "18px",
          padding: spacing["3xl"],
          marginBottom: spacing["2xl"],
        }}>
          {[
            { label: "Mottagare",      value: SWISH_NAME,    valueStyle: { color: "#fff", fontWeight: fonts.weight.bold, fontSize: fonts.size.md } },
            { label: "Swish-nummer",   value: SWISH_NUMBER,  valueStyle: { color: "#FCD34D", fontWeight: fonts.weight.extrabold, fontSize: fonts.size.lg, letterSpacing: "0.04em" } },
            { label: "Belopp",         value: price,         valueStyle: { color: colors.primary, fontWeight: fonts.weight.extrabold, fontSize: fonts.size["2xl"] } },
            { label: "Meddelande",     value: swishMsg,      valueStyle: { color: "rgba(255,255,255,0.80)", fontSize: fonts.size.sm } },
            { label: "Bok för",        value: personName,    valueStyle: { color: "rgba(255,255,255,0.80)", fontSize: fonts.size.sm } },
          ].map(({ label, value, valueStyle }, i, arr) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: i < arr.length - 1 ? spacing.xl : 0,
                marginBottom: i < arr.length - 1 ? spacing.xl : 0,
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.50)", fontSize: fonts.size.sm }}>{label}</span>
              <span style={valueStyle}>{value}</span>
            </div>
          ))}
        </div>

        {/* Öppna Swish-app */}
        <a
          href={deepLink}
          style={{
            display: "block",
            textAlign: "center",
            background: "#00A870",
            color: "#fff",
            borderRadius: "14px",
            padding: `${spacing.lg} ${spacing["3xl"]}`,
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.bold,
            textDecoration: "none",
            marginBottom: spacing.sm,
            boxShadow: "0 4px 20px rgba(0,168,112,0.35)",
          }}
        >
          📱 Öppna Swish-appen
        </a>
        <p style={{ color: "rgba(255,255,255,0.30)", fontSize: fonts.size.xs, textAlign: "center", margin: `0 0 ${spacing["2xl"]}` }}>
          Fungerar på mobil · Swish måste vara installerat
        </p>

        {/* Bekräftelseknapp */}
        <button
          onClick={onPaid}
          style={{
            width: "100%",
            padding: `${spacing.lg} ${spacing["3xl"]}`,
            borderRadius: "14px",
            border: "none",
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            color: "#fff",
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.bold,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(245,158,11,0.40)",
            marginBottom: spacing.md,
          }}
          onMouseOver={(e)  => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(245,158,11,0.50)"; }}
          onMouseOut={(e)   => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,158,11,0.40)"; }}
        >
          ✅ Jag har betalat — skapa min bok nu
        </button>

        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: spacing.md,
            borderRadius: "14px",
            border: "1.5px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "rgba(255,255,255,0.55)",
            fontSize: fonts.size.sm,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Tillbaka till formuläret
        </button>
      </div>
    </section>
  );
}
