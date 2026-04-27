import { SecondaryNav, ImageCarousel, BestsellersSection, HeroSection } from "../components";
import { colors, fonts, spacing } from "../styles/theme";
import { Link } from "react-router-dom";

const COMING_SOON = true; // Sätt till false för att aktivera igen

export function Home() {
  return (
    <>
      <main style={{ background: colors.white }}>
        <SecondaryNav />
        <ImageCarousel />
        {COMING_SOON ? (
          <section style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
            padding: "64px 24px",
            textAlign: "center",
          }}>
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <div style={{ fontSize: 56, marginBottom: 16, filter: "drop-shadow(0 4px 24px rgba(245,158,11,0.4))" }}>✨</div>
              <h2 style={{ color: "#fff", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, fontFamily: "Georgia, serif", margin: "0 0 12px" }}>
                Öppnar snart
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.7, margin: "0 0 32px" }}>
                Vi håller på att finslipa upplevelsen. Skriv upp dig så meddelar vi dig direkt!
              </p>
              <Link to="/skapa" style={{
                display: "inline-block",
                padding: "14px 36px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
              }}>
                Meddela mig när vi öppnar
              </Link>
            </div>
          </section>
        ) : null}
        <BestsellersSection />
        <HeroSection scrollToId={() => {}} />
      </main>
    </>
  );
}
