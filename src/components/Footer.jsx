import { Link } from "react-router-dom";
import { colors, spacing, fonts } from "../styles/theme";
import { useMemo } from "react";

export function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      style={{
        padding: `${spacing["2xl"]} ${spacing.lg}`,
        borderTop: `1px solid ${colors.border}`,
        background: colors.light,
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: spacing["2xl"],
            marginBottom: spacing["2xl"],
          }}
        >
          {/* Company */}
          <div>
            <p style={{ margin: 0, fontWeight: fonts.weight.bold, marginBottom: spacing.md }}>
              minstory.se
            </p>
            <p style={{ margin: 0, opacity: 0.8, fontSize: fonts.size.sm }}>
              Skapa personliga berättelser för människor du älskar.
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ margin: 0, fontWeight: fonts.weight.bold, marginBottom: spacing.md }}>
              Snabblänkar
            </p>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", fontSize: fonts.size.sm }}>
              <li>
                <Link
                  to="/"
                  style={{
                    color: colors.primary,
                    textDecoration: "none",
                    padding: 0,
                    marginBottom: spacing.xs,
                    display: "block",
                  }}
                >
                  Hem
                </Link>
              </li>
              <li>
                <Link
                  to="/hur-det-funkar"
                  style={{
                    color: colors.primary,
                    textDecoration: "none",
                    padding: 0,
                    marginBottom: spacing.xs,
                    display: "block",
                  }}
                >
                  Hur det funkar
                </Link>
              </li>
              <li>
                <Link
                  to="/skapa"
                  style={{
                    color: colors.primary,
                    textDecoration: "none",
                    padding: 0,
                    marginBottom: spacing.xs,
                    display: "block",
                  }}
                >
                  Skapa bok
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p style={{ margin: 0, fontWeight: fonts.weight.bold, marginBottom: spacing.md }}>
              Juridisk
            </p>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", fontSize: fonts.size.sm }}>
              <li>
                <Link
                  to="/integritetspolicy"
                  style={{ color: colors.primary, textDecoration: "none", marginBottom: spacing.xs, display: "block" }}
                >
                  Integritetspolicy
                </Link>
              </li>
              <li>
                <Link
                  to="/anvandarvillkor"
                  style={{ color: colors.primary, textDecoration: "none", marginBottom: spacing.xs, display: "block" }}
                >
                  Användarvillkor
                </Link>
              </li>
              <li>
                <Link
                  to="/kontakt"
                  style={{ color: colors.primary, textDecoration: "none", marginBottom: spacing.xs, display: "block" }}
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ margin: 0, fontWeight: fonts.weight.bold, marginBottom: spacing.md }}>
              Kontakt
            </p>
            <p style={{ margin: 0, opacity: 0.8, fontSize: fonts.size.sm }}>
              📧{" "}
              <a
                href="mailto:hello@minstory.se"
                style={{ color: colors.primary, textDecoration: "none" }}
              >
                hello@minstory.se
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: spacing.lg }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: spacing.md,
              fontSize: fonts.size.sm,
              opacity: 0.8,
            }}
          >
            <span>© {year} minstory.se. Alla rättigheter förbehållna.</span>
            <span>🇸🇪 Made with ❤️ in Sweden</span>
          </div>

          {/* Bokarent-info */}
          <div style={{
            marginTop: spacing.lg,
            paddingTop: spacing.lg,
            borderTop: `1px solid ${colors.border}`,
            textAlign: "center",
            fontSize: fonts.size.xs,
            color: colors.textLight,
            lineHeight: 1.7,
          }}>
            <p style={{ margin: 0 }}>
              minstory.se är en tjänst från{" "}
              <strong style={{ color: colors.text }}>Bokarent Sverige AB</strong>
              {" "}· Org.nr registrerat i Sverige
            </p>
            <p style={{ margin: `${spacing.xs} 0 0` }}>
              © {year} Bokarent Sverige AB · Alla rättigheter förbehållna · minstory.se
            </p>
            <p style={{ margin: `${spacing.md} 0 0` }}>
              <Link
                to="/admin"
                style={{
                  fontSize: "11px",
                  color: colors.textLight,
                  opacity: 0.4,
                  textDecoration: "none",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.4"; }}
              >
                admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
