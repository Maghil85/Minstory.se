import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fonts, spacing } from "../styles/theme";

const STORAGE_KEY = "minstory_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Visa bannern om användaren inte svarat än
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Liten fördröjning så sidan hinner laddas klart
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-samtycke"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(560px, calc(100vw - 32px))",
        background: "#1a1a2e",
        border: "1.5px solid rgba(245,158,11,0.30)",
        borderRadius: "18px",
        padding: `${spacing.xl} ${spacing["2xl"]}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.40)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: spacing.lg,
      }}
    >
      {/* Text */}
      <div style={{ display: "flex", gap: spacing.md, alignItems: "flex-start" }}>
        <span style={{ fontSize: "26px", lineHeight: 1, flexShrink: 0 }}>🍪</span>
        <div>
          <p style={{
            margin: `0 0 ${spacing.xs}`,
            fontSize: fonts.size.sm,
            fontWeight: fonts.weight.bold,
            color: "#fff",
          }}>
            Vi använder cookies
          </p>
          <p style={{
            margin: 0,
            fontSize: "13px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.6,
          }}>
            Vi använder nödvändiga cookies för att webbplatsen ska fungera korrekt. Vi använder inga spårnings- eller reklamcookies.{" "}
            <Link
              to="/integritetspolicy"
              style={{ color: "#FCD34D", textDecoration: "underline" }}
            >
              Läs vår integritetspolicy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Knappar */}
      <div style={{ display: "flex", gap: spacing.md, justifyContent: "flex-end" }}>
        <button
          onClick={decline}
          style={{
            padding: `${spacing.sm} ${spacing.xl}`,
            borderRadius: "10px",
            border: "1.5px solid rgba(255,255,255,0.18)",
            background: "transparent",
            color: "rgba(255,255,255,0.55)",
            fontSize: fonts.size.sm,
            fontWeight: fonts.weight.semibold,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Neka
        </button>
        <button
          onClick={accept}
          style={{
            padding: `${spacing.sm} ${spacing.xl}`,
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #F59E0B, #D97706)",
            color: "#fff",
            fontSize: fonts.size.sm,
            fontWeight: fonts.weight.bold,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 3px 14px rgba(245,158,11,0.40)",
          }}
        >
          Acceptera
        </button>
      </div>
    </div>
  );
}
