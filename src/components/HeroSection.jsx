import { Link } from "react-router-dom";
import { PrimaryButton, SecondaryButton } from "./UI";
import { colors, spacing, fonts } from "../styles/theme";

export function HeroSection() {

  return (
    <section
      id="top"
      style={{
        background: `linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.1) 100%)`,
        position: "relative",
        overflow: "hidden",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Animated gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.pastelBlue}, transparent)`,
          opacity: 0.3,
          pointerEvents: "none",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-8%",
          left: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.pastelPink}, transparent)`,
          opacity: 0.25,
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite 1s",
        }}
      />

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: `${spacing["3xl"]} ${spacing.lg}`,
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        {/* Content */}
        <div style={{ animation: "slideInUp 1s ease-out" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.md,
              marginBottom: spacing["2xl"],
            }}
          >
            <span
              style={{
                fontSize: fonts.size.sm,
                fontWeight: fonts.weight.bold,
                color: "#F59E0B",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Personliga böcker för alla
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "56px",
              lineHeight: 1.15,
              margin: 0,
              marginBottom: spacing["2xl"],
              color: "#D97706",
              fontWeight: fonts.weight.extrabold,
              textShadow: "0 1px 2px rgba(217, 119, 6, 0.12)",
            }}
          >
            Du är hjälte
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: fonts.size.xl,
              lineHeight: 1.7,
              color: colors.textLight,
              marginBottom: spacing["2xl"],
              maxWidth: 700,
              margin: `0 auto ${spacing["2xl"]}`,
              fontWeight: fonts.weight.medium,
            }}
          >
            En kärlekshistoria för din partner. En saga om din bästa vän. Minnen från din morfar. Vad du än vill
            berätta – vi gör det till en magisk bok.
          </p>

          {/* Features */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: spacing.lg,
              marginBottom: spacing["3xl"],
            }}
          >
            {[
              { icon: "⚡", text: "Unikt skapad för dig" },
              { icon: "🎯", text: "100% personligt" },
              { icon: "📦", text: "Digital & tryck" },
              { icon: "💝", text: "Perfekt present" },
            ].map((feature) => (
              <div key={feature.text} style={{ display: "flex", gap: spacing.md, alignItems: "flex-start" }}>
                <span style={{ fontSize: "24px", flexShrink: 0 }}>{feature.icon}</span>
                <span
                  style={{
                    fontSize: fonts.size.md,
                    fontWeight: fonts.weight.medium,
                    color: colors.text,
                  }}
                >
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(30px);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>

      {/* Mobile Responsive */}
      <style>{`
        @media (max-width: 768px) {
          body {
            --grid-template-columns: 1fr;
          }

          h1 {
            font-size: 36px !important;
          }
        }
      `}</style>
    </section>
  );
}
