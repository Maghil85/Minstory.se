import { useState, useEffect, useRef } from "react";
import { colors, spacing, fonts } from "../styles/theme";

const SWISH_NUMBER  = import.meta.env.VITE_SWISH_NUMBER || "1230947887";
const SWISH_NAME    = import.meta.env.VITE_SWISH_NAME   || "ITfaktor, BokaRent Sverige";
const WAIT_SECONDS  = 30; // sekunder att vänta efter Swish-klick

export function SwishPayment({ price, pageCount, personName, onPaid, onBack }) {
  const [countdown, setCountdown] = useState(null); // null = not started, 0 = done
  const timerRef = useRef(null);

  const amountNum = price ? parseInt(price.replace(/[^0-9]/g, ""), 10) : 0;
  const swishMsg  = `Minstory ${pageCount} sidor`;
  const swishData = JSON.stringify({
    version: 1,
    payee:   { value: SWISH_NUMBER.replace(/\s/g, ""), editable: false },
    amount:  { value: amountNum, editable: false },
    message: { value: swishMsg, editable: false },
  });
  const deepLink = `swish://payment?data=${encodeURIComponent(swishData)}`;

  function handleSwishClick() {
    window.location.href = deepLink;
    if (countdown !== null) return; // already started
    setCountdown(WAIT_SECONDS);
  }

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    timerRef.current = setTimeout(() => {
      const next = countdown - 1;
      setCountdown(next);
      if (next === 0) onPaid(); // automatisk start när tid är ute
    }, 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

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
            { label: "Org. nr / namn",  value: "ITfaktor, BokaRent Sverige", valueStyle: { color: "rgba(255,255,255,0.65)", fontSize: fonts.size.sm } },
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
        <button
          onClick={handleSwishClick}
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            background: "#00A870",
            color: "#fff",
            borderRadius: "14px",
            padding: `${spacing.lg} ${spacing["3xl"]}`,
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.bold,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: spacing.sm,
            boxShadow: "0 4px 20px rgba(0,168,112,0.35)",
          }}
        >
          📱 Öppna Swish-appen
        </button>
        <p style={{ color: "rgba(255,255,255,0.30)", fontSize: fonts.size.xs, textAlign: "center", margin: `0 0 ${spacing["2xl"]}` }}>
          Fungerar på mobil · Swish måste vara installerat
        </p>

        {/* Status efter Swish-klick */}
        {countdown === null ? (
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: fonts.size.xs, textAlign: "center", margin: `0 0 ${spacing.md}` }}>
            Öppna Swish-appen ovan och genomför betalningen. Boken startas automatiskt.
          </p>
        ) : (
          <div style={{ textAlign: "center", marginBottom: spacing.md }}>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: fonts.size.sm, margin: `0 0 ${spacing.sm}` }}>
              {countdown > 0 ? "Genomför betalningen i Swish…" : "Betalning mottagen — startar din bok! 🎉"}
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 64, height: 64, borderRadius: "50%",
              border: `3px solid ${countdown > 0 ? colors.primary : "#00A870"}`,
              color: countdown > 0 ? colors.primary : "#00A870",
              fontSize: countdown > 0 ? fonts.size.lg : 28,
              fontWeight: fonts.weight.extrabold,
              transition: "border-color 0.3s, color 0.3s",
            }}>
              {countdown > 0 ? countdown : "✓"}
            </div>
          </div>
        )}

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
