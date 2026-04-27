import { Link } from "react-router-dom";
import { colors, spacing, fonts } from "../styles/theme";

export function NotFoundPage() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: `${spacing["5xl"]} ${spacing.lg}`,
      background: colors.white,
    }}>
      <div style={{ fontSize: "72px", marginBottom: spacing.xl }}>📖</div>
      <h1 style={{
        fontSize: fonts.size["4xl"],
        fontWeight: fonts.weight.extrabold,
        color: colors.dark,
        margin: `0 0 ${spacing.md}`,
        fontFamily: "Georgia, serif",
      }}>
        404 — Sidan hittades inte
      </h1>
      <p style={{
        fontSize: fonts.size.lg,
        color: colors.text,
        margin: `0 0 ${spacing["3xl"]}`,
        opacity: 0.7,
        maxWidth: 420,
        lineHeight: 1.6,
      }}>
        Den här sidan verkar inte existera. Kanske letade du efter något annat?
      </p>
      <div style={{ display: "flex", gap: spacing.lg, flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" style={{
          padding: `${spacing.lg} ${spacing["3xl"]}`,
          borderRadius: "14px",
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          color: "#fff",
          textDecoration: "none",
          fontWeight: fonts.weight.bold,
          fontSize: fonts.size.md,
          boxShadow: "0 4px 18px rgba(245,158,11,0.35)",
        }}>
          🏠 Till startsidan
        </Link>
        <Link to="/skapa" style={{
          padding: `${spacing.lg} ${spacing["3xl"]}`,
          borderRadius: "14px",
          border: `1.5px solid ${colors.border}`,
          background: colors.white,
          color: colors.dark,
          textDecoration: "none",
          fontWeight: fonts.weight.semibold,
          fontSize: fonts.size.md,
        }}>
          ✨ Skapa en bok
        </Link>
      </div>
    </div>
  );
}
